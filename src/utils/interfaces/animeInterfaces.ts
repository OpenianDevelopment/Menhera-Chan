//Anime Interfaces
export interface mal_anime_search_result {
	pagination: {
		last_visible_page: number;
		has_next_page: boolean;
	};
	data: mal_anime_search_result_data[];
}
export interface mal_anime_search_result_data {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
	trailer: {
		youtube_id: string;
		url: string;
		embed_url: string;
	};
	title: string;
	title_english: string;
	title_japanese: string;
	title_synonyms: string;
	type: string;
	source: string;
	episodes: number;
	status: string;
	airing: boolean;
	aired: {
		from: string;
		to: string;
		prop: {
			from: {
				day: number;
				month: number;
				year: number;
			};
			to: {
				day: number;
				month: number;
				year: number;
			};
			string: string;
		};
	};
	duration: string;
	rating: string;
	score: number;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis: string;
	background: string;
	season: string;
	year: string;
	broadcast: {
		day: string;
		time: string;
		timezone: string;
		string: string;
	};
	producers: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
	licensors: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
	studios: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
	genres: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
}

//Manga Interfaces
export interface mal_manga_search_result {
	pagination: {
		last_visible_page: number;
		has_next_page: boolean;
	};
	data: mal_manga_search_result_data[];
}
export interface mal_manga_search_result_data {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
	title: string;
	title_english: string;
	title_japanese: string;
	title_synonyms: string;
	type: string;
	chapters: number;
	volumes: number;
	status: string;
	publishing: boolean;
	published: {
		from: string;
		to: string;
		prop: {
			from: {
				day: number;
				month: number;
				year: number;
			};
			to: {
				day: number;
				month: number;
				year: number;
			};
			string: string;
		};
	};
	score: number;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis: string;
	background: string;
	authors: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
	serializations: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
	genres: {
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}[];
}

//Profile Interfaces
