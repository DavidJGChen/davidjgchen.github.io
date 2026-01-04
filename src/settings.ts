export const profile = {
	fullName: 'David Chen',
	title: 'Master\'s student',
	institute: 'Stanford University',
	author_name: '', // Author name to be highlighted in the papers section
	research_areas: [
		{ title: 'Reinforcement Learning', description: 'Multi-armed bandits, offline RL, etc.', field: 'engineering' },
		{ title: 'Mathematical Statistics', description: 'Currently taking a subset of the Stats PhD sequence.', field: 'mathematics' },
	],
}

// Set equal to an empty string to hide the icon that you don't want to display
export const social = {
	email: 'dchen11@stanford.edu',
	linkedin: 'https://www.linkedin.com/in/davidjgchen',
	x: '',
	bluesky: '',
	github: 'https://github.com/DavidJGChen',
	gitlab: '',
	scholar: '',
	inspire: '',
	arxiv: '',
	orcid: '',
}

export const template = {
	website_url: 'https://localhost:4321', // Astro needs to know your site’s deployed URL to generate a sitemap. It must start with http:// or https://
	menu_left: false,
	transitions: true,
	lightTheme: 'light', // Select one of the Daisy UI Themes or create your own
	darkTheme: 'dark', // Select one of the Daisy UI Themes or create your own
	excerptLength: 200,
	postPerPage: 5,
    base: '' // Repository name starting with /
}

export const seo = {
	default_title: 'David Chen | MSCS',
	default_description: 'David Chen is a Master\'s student in Computer Science at Stanford University, studying artificial intelligence and statistics. He is especially interested in machine learning theory, and is currently learning more about statistics, decision-making under uncertainty, and combinatorial optimization.',
	default_image: '/images/astro-academia.png',
}
