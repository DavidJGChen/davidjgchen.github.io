export const experiences = [
	{
		company: 'Meta Platforms',
		time: '2021 - 2025',
		title: 'Software Engineer',
		location: 'Menlo Park, CA',
		description: 'Product software engineer on Facebook.',
	},
	{
		company: 'Facebook',
		time: '2020',
		title: 'Software Engineer Intern',
		location: 'Menlo Park, CA',
		description: 'AR/VR SWE intern on Horizon Worlds.',
	},
	{
		company: 'GoDaddy',
		time: '2019',
		title: 'Software Development Engineer Intern',
		location: 'Kirkland, WA',
		description: '',
	},
	{
		company: 'Akamai Technologies',
		time: '2018',
		title: 'Software Development Engineer in Test Intern',
		location: 'Cambridge, MA',
		description: '',
	},
];

export const education = [
	{
		school: 'Carnegie Mellon University: School of Computer Science',
		time: '2017 - 2021',
		degree: 'Bachelor’s in Computer Science',
		location: 'Pittsburgh, PA',
		description: 'Simultaneously pursued a minor in mathematics.',
	},
	{
		school: 'Stanford University',
		time: '2022 - 2025',
		degree: 'Artificial Intelligence Graduate Certificate',
		location: 'Stanford, CA',
		description: 'Completed various ML and stats coursework + projects',
	},
	{
		school: 'Stanford University',
		time: '2025 - 2027',
		degree: 'Master’s in Computer Science: AI',
		location: 'Stanford, CA',
		description: 'Studying more ML and statistics!',
	},
];

export const skills = [
	{
		title: 'Section under construction!',
		description: 'Check back in a few weeks!',
	},
];

export const publications = [
	{
		title: 'Exploring Bandit Algorithms',
		authors: 'David Chen',
		journal: 'CS 221',
		time: '2025',
		link: '/papers/bandits.pdf',
		thumbnail: '/images/bandits.png',
		abstract: 'This project evaluates classic and modern stochastic multi-armed bandit algorithms by comparing their theoretical regret bounds against empirical performance and runtime. I developed a simulation framework to test strategies such as ϵ-greedy, Thompson sampling, and information-directed sampling across independent and linear bandit settings. This comprehensive analysis aims to provide both quantitative benchmarks and qualitative insights into how different exploration-exploitation strategies behave in practice.',
	},
	{
		title: 'Evaluating Stitching Capabilities of RvS Transformer Algorithms',
		authors: 'David Chen',
		journal: 'CS 234',
		time: '2024',
		link: '/papers/stitching-paper.pdf',
		thumbnail: '/images/stitching.png',
		abstract: 'This paper benchmarks the ability of Transformer-based reinforcement learning methods to "stitch" suboptimal trajectories into optimal policies across challenging AntMaze environments. We introduce an enhanced Waypoint Transformer with a refined waypoint selection strategy that improves performance. These contributions provide a comprehensive evaluation of current sequence modeling approaches and suggest new avenues for goal-conditioned behavior cloning.',
	},
];
