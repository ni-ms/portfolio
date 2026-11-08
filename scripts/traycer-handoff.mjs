#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const at = (name) => path.join(root, name);
const read = (name) => readFileSync(at(name), 'utf8');
const json = (name) => JSON.parse(read(name));
const statuses = new Set(['pending', 'in_progress', 'review', 'done', 'blocked']);

function validate(tasks, state) {
  const errors = [];
  const required = [
    'AGENTS.md', 'README.md', 'TRAYCER_PROMPT.txt', 'TRAYCER_HANDOFF.md',
    'docs/portfolio-content.json', 'docs/implementation/AGENT_PROTOCOL.md',
    'docs/implementation/CONTRACTS.md', 'docs/implementation/TASKS.md',
    'docs/implementation/PROGRESS.md',
    'design/source/Resume_Nikhil_Sharma_2026-11.docx',
    '.traycer/agent-selection-guide.md'
  ];
  const ids = new Set(tasks.tickets.map((t) => t.id));
  if (ids.size !== 8 || ids.size !== tasks.tickets.length) errors.push('Expected eight unique tickets.');
  for (const file of required) if (!existsSync(at(file))) errors.push('Missing ' + file);
  for (const ticket of tasks.tickets) {
    if (!existsSync(at(ticket.ticket))) errors.push('Missing ticket file ' + ticket.id);
    for (const ref of ticket.references) if (!existsSync(at(ref))) errors.push('Missing reference ' + ref);
    for (const dependency of ticket.dependencies) if (!ids.has(dependency)) errors.push('Unknown dependency ' + dependency);
    const current = state.tasks[ticket.id];
    if (!current || !statuses.has(current.status)) errors.push('Invalid execution state for ' + ticket.id);
    if (current?.status === 'done') {
      if (!existsSync(at(current.report))) errors.push('Completed ticket lacks report: ' + ticket.id);
      if (!current.resultCommit && !current.resultPatch) errors.push('Completed ticket lacks result commit/patch: ' + ticket.id);
      for (const dependency of ticket.dependencies) {
        if (state.tasks[dependency]?.status !== 'done') errors.push('Completed ticket has unfinished dependency: ' + ticket.id);
      }
    }
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) { errors.push('Dependency cycle at ' + id); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const ticket = tasks.tickets.find((t) => t.id === id);
    if (ticket) for (const dep of ticket.dependencies) visit(dep);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids) visit(id);
  for (const slug of ['home', 'projects', 'fastcode', 'resume', 'about']) {
    for (const theme of ['dark', 'light']) {
      const file = 'design/mockups/current-theme/' + slug + '-' + theme + '.png';
      if (!existsSync(at(file))) { errors.push('Missing ' + file); continue; }
      const header = readFileSync(at(file)).subarray(0, 8).toString('hex');
      if (header !== '89504e470d0a1a0a') errors.push('Invalid PNG ' + file);
    }
  }
  if (existsSync(at('docs/portfolio-content.json'))) {
    const content = json('docs/portfolio-content.json');
    const actual = new Set(content.projects.map((p) => p.slug));
    for (const slug of ['fastcode', 'scottypi', 'langmetric']) if (!actual.has(slug)) errors.push('Missing project content ' + slug);
    if (content.identity.name !== 'Nikhil Sharma') errors.push('Unexpected portfolio identity.');
  }
  return errors;
}

try {
  const command = process.argv[2] || 'status';
  if (command === 'prompt') {
    process.stdout.write(read('TRAYCER_PROMPT.txt'));
  } else if (['check', 'status', 'packet'].includes(command)) {
    const tasks = json('docs/implementation/tasks.json');
    const state = json('docs/implementation/state.json');
    if (command === 'check') {
      const errors = validate(tasks, state);
      if (errors.length) {
        process.stderr.write(errors.join('\n') + '\n');
        process.exitCode = 1;
      } else {
        console.log('Handoff valid: 8 tickets, acyclic dependencies, 10 approved PNGs, portable content and resume source.');
      }
    } else if (command === 'status') {
      for (const ticket of tasks.tickets) {
        const current = state.tasks[ticket.id];
        const ready = current.status === 'pending' && ticket.dependencies.every((id) => state.tasks[id].status === 'done');
        console.log(ticket.id + '  ' + current.status.padEnd(12) + (ready ? ' READY  ' : '        ') + ticket.title);
      }
      console.log('\nActive: ' + (state.activeTicket || 'none') + '; phase: ' + state.phase);
      console.log('Resume from docs/implementation/PROGRESS.md and the relevant ticket report.');
    } else {
      const id = (process.argv[3] || '').toUpperCase();
      const ticket = tasks.tickets.find((t) => t.id === id);
      if (!ticket) throw new Error('Use packet T01 through packet T08.');
      const unfinished = ticket.dependencies.filter((dep) => state.tasks[dep].status !== 'done');
      console.log('TICKET ' + id + ': ' + ticket.title);
      console.log('State: ' + state.tasks[id].status + '; owner role: ' + ticket.owner);
      console.log('Prerequisites: ' + (unfinished.length ? 'NOT READY: ' + unfinished.join(', ') : 'dependencies satisfied'));
      console.log('Read policy: AGENTS.md; docs/implementation/AGENT_PROTOCOL.md; docs/implementation/CONTRACTS.md.');
      console.log('Owned paths: ' + ticket.allowedPaths.join(', '));
      console.log('Inspect references on demand, one page pair at a time:\n' + ticket.references.join('\n'));
      console.log('\n' + read(ticket.ticket));
      const report = state.tasks[id].report;
      if (existsSync(at(report))) {
        console.log('\nRECOVERY REPORT: ' + report);
        const text = read(report);
        console.log(text.length <= 12000 ? text : 'Report exceeds packet budget; inspect its recovery/next-action sections directly.');
      }
    }
  } else {
    throw new Error('Usage: node scripts/traycer-handoff.mjs check|status|packet Txx|prompt');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
