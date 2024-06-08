<script lang="ts">
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';

	// Define the interface for the timeline data
	interface TimelineItem {
		year: string;
		title: string;
		description: string;
		timeline: string;
	}

	let cards = [
		{ title: 'OEE Software', text: 'Some text', link: 'https://github.com/ni-ms/oee_software_melss' },
		{ title: 'AI Real Time Chat', text: 'Some other text', link:'https://github.com/ni-ms/real-time-chat' },
		{ title: 'Full Stack Car Parking', text: 'Some other text', link:'https://github.com/ni-ms/Car_Park_Front_End' },
		{ title: 'Neural Networks', text: 'Some other text', link:'https://github.com/ni-ms/coursera_neural_networks_and_dl' },
		{ title: 'Device Key Server', text: 'Some other text', link:'https://github.com/ni-ms/device_key_server' },
		{ title: 'Full Stack Todo List', text: 'Some other text', link:'https://github.com/ni-ms/todo-full-stack' },
		{ title: 'FPS Game', text: 'Some other text' , link:'https://github.com/ni-ms/fps_game'},
		{ title: 'Rust Chat App', text: 'Some other text' },
		{ title: 'Grammar for C', text: 'Some other text' },
		{ title: 'Chat App', text: 'Some other text' },
		{ title: 'Mini C Compiler', text: 'Some other text' },
		{ title: 'Multithreaded Matrix Multiplication', text: 'Some other text' },
		{ title: 'Classification in ML', text: 'Some other text' },
		{ title: 'Logistic Regression', text: 'Some other text' },
		{ title: 'Decision Tree', text: 'Some other text' },
		{ title: 'Snake Game in Rust', text: 'Some other text' },
		{ title: 'Polygon Decomposition', text: 'Some other text' },
		{ title: 'Regex Compiler', text: 'Some other text' },
		{ title: 'FPS Game ( Godot )', text: 'Some other text' },
		{ title: 'Radiosity Implementation', text: 'Some other text' },
		{ title: 'Obstacle Runner', text: 'Some other text' }
	];

	// Create an array of timeline data
	let timelineData: TimelineItem[] = [
		{
			year: 'May 2022 - July 2022',
			title: 'MEL System and Services',
			description: 'Interned in web development using Python, employing Django, MongoDB, HTML, JavaScript, and Bootstrap. Designed a web app to calculate OEE scores for production lines using user-specific authorization system.',
			timeline: 'start'
		},
		{
			year: 'Jan 2024 - July 2024',
			title: 'Exeevo',
			description: 'Full stack intern in a startup, working on a project to create a platform for the medical industry. Worked on a team to develop a web app using Angular, Ionic, Cordova and Microsoft CRM APIs.',
			timeline: 'end'
		}

	];
</script>

<div class="p-10 md:p-32" in:fade>
	<h1 class="text-3xl md:text-5xl font-bold underline animate-fade-in">Skills </h1>
	<br />
	<h2 class="text-3xl md:text-5xl font-bold animate-fade-in">Full stack web development</h2>
	<div class="scroll-container md:w-[500px] w-72">
		<div class="badge">HTML</div>
		<div class="badge">CSS</div>
		<div class="badge">JavaScript</div>
		<div class="badge">TypeScript</div>
		<div class="badge">React</div>
		<div class="badge">Node.js</div>
		<div class="badge">Express</div>
		<div class="badge">MongoDB</div>
		<div class="badge">Three JS</div>
		<div class="badge">Django</div>
		<div class="badge">Spring Boot</div>
		<div class="badge">MySQL</div>
		<div class="badge">SQLite</div>
		<div class="badge">RESTful APIs</div>
		<div class="badge">Vue Js</div>
		<div class="badge">SvelteKit</div>
	</div>
	<div class="pl-7">
		<ul class="list-disc">
			<li>Proficient in building end-to-end web applications using technologies like React, Node.js, and Express.</li>
			<li>Experience with MongoDB, MySQL, and SQLite for database management.</li>
			<li>Skilled in HTML, CSS, and JavaScript.</li>
			<li>Familiar with TypeScript for type-safe development.</li>
			<li>Proficient in server-side frameworks such as Django and Spring Boot to create RESTful APIs.</li>
			<li>Worked with Vue.js, Angular and SvelteKit for dynamic and responsive user interfaces.</li>
		</ul>
	</div>
	<br />
	<h2 class="text-3xl md:text-5xl font-bold animate-fade-in">Machine Learning & AI</h2>
	<div class="scroll-container">
		<div class="badge">Python</div>
		<div class="badge">Scikit Learn</div>
		<div class="badge">Numpy</div>
		<div class="badge">Pandas</div>
		<div class="badge">Tensorflow</div>
		<div class="badge">Stable Diffusion</div>
		<div class="badge">Jupyter</div>
	</div>
	<div class="pl-7">
		<ul class="list-disc">
			<li>Proficient in using Python for data manipulation, analysis, and machine learning.</li>
			<li>Familiar with libraries like Scikit-Learn, NumPy, and Pandas.</li>
			<li>Experienced with TensorFlow for building neural networks and deep learning models.</li>
			<li>Passionate about solving complex problems using artificial intelligence.</li>
			<li>Knowledgeable about Stable Diffusion algorithms for modeling data with heavy-tailed distributions.</li>
			<li>Regularly use Jupyter notebooks for interactive data exploration, visualization, and model development.</li>

		</ul>
	</div>
	<br />

	<h2 class="text-3xl md:text-5xl font-bold animate-fade-in">Software Development</h2>
	<div class="scroll-container">
		<div class="badge">Rust</div>
		<div class="badge">React Native</div>
		<div class="badge">Ionic Framework</div>
		<div class="badge">Java</div>
		<div class="badge">SQL</div>
		<div class="badge">Godot</div>
		<div class="badge">Unity</div>

		<div class="badge"></div>
	</div>
	<div class="pl-7">
		<ul class="list-disc">
			<li>Experience in developing desktop apps and games.</li>
			<li>Used Ionic framework with cordova to build cross platform apps for both web and android</li>
			<li>Experience with Database tools like SQL and Mongoose</li>
			<li>Developed games with Unity and Godot</li>
		</ul>
	</div>

	<br />
	<br />
	<h1 class="text-3xl md:text-5xl font-bold underline animate-fade-in">Experience </h1>

	<!-- Timeline Data -->
	<ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
		{#each timelineData as item (item.year)}
			<li>
				<div class="timeline-middle">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
						<path fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
									clip-rule="evenodd" />
					</svg>
				</div>
				<div class="timeline-start md:text-end mb-10">
					<time class="font-mono italic">{item.year}</time>
					<div class="text-lg font-black">{item.title}</div>
					{item.description}
				</div>
				<hr />
			</li>
		{/each}
	</ul>

	<br />
	<br />

	<!-- Projects -->
	<h1 class="text-3xl md:text-5xl font-bold underline animate-fade-in">Projects </h1>
	<br />
	<div class="dropdown">
		<div tabindex="0" role="button" class="btn m-1">Click</div>
		<ul
			class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 h-[300px]">
			<li class="block"><a href="{base}/">All</a></li>
			<li class="block"><a href="{base}/">Full Stack</a></li>
			<li class="block"><a href="{base}/">Back End</a></li>
			<li class="block"><a href="{base}/">Machine Learning</a></li>
			<li class="block"><a href="{base}/">Game Development</a></li>
			<li class="block"><a href="{base}/">Miscellaneous</a></li>
		</ul>

	</div>

	<div class="flex flex-wrap justify-left">
		{#each cards as card (card.title)}
			<div class="card bg-gray-700 text-white w-[200px] h-[200px] m-2 p-4 rounded-b-3xl shadow">
				<h2 class="font-bold">{card.title}</h2>
				<p>{card.text}</p>
				{#if card.link}
					<a href="{card.link}" class="btn">View</a>
				{/if}
			</div>
		{/each}
	</div>

	<div class="fixed right-10 md:right-10 top-1/2 transform -translate-y-1/2 space-y-2 sm:space-y-4">
		<ul class="steps steps-vertical text-sm sm:text-base slide-in backdrop-blur-2xl rounded-2xl">
			<li class="step">Skills</li>
			<li class="step">Experience</li>
			<li class="step">Projects</li>
		</ul>
	</div>

</div>

<style>
    .slide-in {
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .slide-in:hover {
        transform: translateX(0);
    }

    @media (min-width: 768px) {
        .slide-in {
            transform: none;
        }

        .slide-in:hover {
            transform: none;
        }
    }

    .scroll-container {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
    }

    .steps {
        list-style: none;
        padding: 0;
    }

    .steps-vertical .step {
        margin-bottom: 1em;
    }

</style>