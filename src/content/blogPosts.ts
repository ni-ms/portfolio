import { projectsBySlug } from './realPortfolio';

const fastCode = projectsBySlug.fastcode;
const scottyPi = projectsBySlug.scottypi;

export const blogPosts = [
  {
    slug: 'optimizing-1x1-convolution',
    title: 'Optimizing 1×1 convolution on a CPU',
    summary: 'How vector instructions, register blocking, and input packing work together in FastCode.',
    project: fastCode,
    sections: [
      {
        heading: 'Keep partial results in registers',
        text: 'A 1×1 convolution combines input channels at each spatial location. FastCode uses AVX2 and fused multiply-add instructions to work on several values at once. Register blocking keeps partial sums in registers while the kernel accumulates them, reducing trips to memory.',
      },
      {
        heading: 'Pack inputs for reuse',
        text: 'The kernel also rearranges inputs before computation so the values it needs together are easier to access from cache. Packing has a cost of its own, so the relevant measurement is latency for the workload that uses the packed inputs.',
      },
      {
        heading: 'Report the workload with the result',
        text: `On the primary YOLOv8n FP32 workload, latency went from ${fastCode.details.baselineMicroseconds} µs with OpenCV to ${fastCode.details.optimizedMicroseconds} µs with FastCode, a ${fastCode.details.reductionPercent}% reduction. The result applies to that benchmark workload.`,
      },
    ],
  },
  {
    slug: 'combining-keyword-and-semantic-search',
    title: 'Combining keyword and semantic search',
    summary: 'Why ScottyPi ranks campus pages twice before combining the results.',
    project: scottyPi,
    sections: [
      {
        heading: 'Give exact names and paraphrases a way in',
        text: 'A campus question can name a program exactly or describe it in everyday language. ScottyPi uses BM25 for keyword matches and fine-tuned MiniLM embeddings for semantic matches. Each method ranks passages from the same set of official Carnegie Mellon Silicon Valley pages.',
      },
      {
        heading: 'Combine positions in the two lists',
        text: 'The two retrieval methods produce different kinds of scores. Reciprocal-rank fusion combines their ranked lists using each passage’s position. A passage that appears near the top of both lists gains support from both methods.',
      },
      {
        heading: 'Measure retrieval separately',
        text: `The index covered ${scottyPi.details.passages} passages from ${scottyPi.details.officialCmuSvPages} official pages. Evaluation used ${scottyPi.details.evaluationQuestions} questions and tracked Recall@1, Recall@3, and mean reciprocal rank. Those metrics measure whether the relevant passage appears near the top of the results.`,
      },
    ],
  },
];

export type BlogPost = (typeof blogPosts)[number];
