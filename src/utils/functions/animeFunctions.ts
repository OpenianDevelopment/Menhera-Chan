import axios from "axios";
import {
    mal_anime_search_result,
    mal_manga_search_result,
} from "../interfaces/animeInterfaces";
const jikanAPI = axios.create({
    baseURL: "https://api.jikan.moe/v4",
});
export async function getAnimeSearch(query: string) {
    const { data: search_result } = await jikanAPI.get<mal_anime_search_result>(
        `anime?q=${query}&sfw`
    );
    return search_result;
}
export async function getMangaSearch(query: string) {
    const { data: search_result } = await jikanAPI.get<mal_manga_search_result>(
        `manga?q=${query}&sfw`
    );
    return search_result;
}
