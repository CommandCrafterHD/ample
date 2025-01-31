import { get } from "svelte/store";

import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { MediaPlayer } from "../stores/player";

import { debugHelper } from "./helper";

let serverURL_value = get(serverURL);

/**
 * Make API request for playlist data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchPlaylistData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.playlist) ? data.playlist : data;
            } else {
                return [];
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

/**
 * Get playlist by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getPlaylist = async (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getPlaylist");

    let playlist = await fetchPlaylistData(queryURL);

    let mp = get(MediaPlayer);
    await mp.setWaveColors();

    return playlist;
}

/**
 * Get playlist by name
 * @param {string} name
 * @returns {Promise<*>}
 */
export const getPlaylistByName = async (name) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlists&filter=" + encodeURI(name);
    queryURL += "&exact=1";
    queryURL += "&limit=1";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getPlaylistByName");

    let playlist = await fetchPlaylistData(queryURL);

    // convert into a single result
    playlist = playlist.length > 0 ? playlist[0] : [];

    return playlist;
}

/**
 * Get all playlists
 * @returns {Promise<*>}
 */
export const getPlaylists = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlists&hide_search=1";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getPlaylists");
    return fetchPlaylistData(queryURL);
}

/**
 * Get all smartlists (filtered from playlists)
 * @returns {Promise<*>}
 */
export const getSmartlists = (stripPrefix = false) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlists";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSmartlists");

    return fetchPlaylistData(queryURL)
        .then((result) => {
            result = result.filter(function(item) {
                return item.id.match(/^smart_/);
            })

            if (stripPrefix) {
                result.forEach((element, index) => {
                    result[index].id = element.id.replace('smart_', '');
                });
            }

            return result;
        });
}

/**
 * Get playlists through advanced search
 * @returns {Promise<*>}
 */
export const getPlaylistsFromAdvancedSearch = ({rows = [], limit = 0, random = false, match = "and"}) => {
    random = (random) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=" + limit;
    queryURL += "&random=" + random;
    queryURL += "&type=playlist&operator=" + match;

    for (let i = 0; i < rows.length; i++) {
        let counter = parseInt(i + 1);
        queryURL += `&rule_${counter}=${rows[i].field}&rule_${counter}_operator=${rows[i].operator}&rule_${counter}_input=${encodeURI(rows[i].input)}`;
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getPlaylistsFromAdvancedSearch");
    return fetchPlaylistData(queryURL);
}

/**
 * Create a playlist
 * @param {string} name
 * @param {string} type
 * @returns {Promise<*>}
 */
export const createPlaylist = ({name = "Untitled", type = "public"}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_create";
    queryURL += "&name=" + encodeURI(name);
    queryURL += "&type=" + type;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "createPlaylist");

    return fetchPlaylistData(queryURL);
}

/**
 * Edit an existing playlist
 * @param {number} id
 * @param {string} name
 * @param {string} type
 * @returns {Promise<*>}
 */
export const editPlaylist = ({id = '', name = "Untitled", type = "public"}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_edit&filter=" + id;
    queryURL += "&name=" + encodeURI(name);
    queryURL += "&type=" + type;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "editPlaylist");

    return fetchPlaylistData(queryURL);
}

/**
 * Reorder an existing playlist
 * @param {number} id
 * @param {string} items
 * @param {string} tracks
 * @returns {Promise<*>}
 */
export const reorderPlaylist = ({id = '', items = '', tracks = ''}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_edit&filter=" + id;
    queryURL += "&items=" + items;
    queryURL += "&tracks=" + tracks;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "reorderPlaylist");

    return fetchPlaylistData(queryURL);
}

/**
 * Delete playlist by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const deletePlaylist = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_delete&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "deletePlaylist");

    return fetchPlaylistData(queryURL);
}

/**
 * Add song to playlist
 * @returns {Promise<*>}
 */
export const addToPlaylist = ({playlistID = '', songID = '', ignoreDuplicates = 0}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_add_song";
    queryURL += "&filter=" + playlistID;
    queryURL += "&song=" + songID;
    queryURL += "&check=" + ignoreDuplicates;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "addToPlaylist");
    return fetchPlaylistData(queryURL);
}

/**
 * Remove song to playlist
 * @returns {Promise<*>}
 */
export const removeFromPlaylist = ({playlistID = '', songID = ''}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_remove_song";
    queryURL += "&filter=" + playlistID;
    queryURL += "&song=" + songID;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "removeFromPlaylist");
    return fetchPlaylistData(queryURL);
}

/**
 * Returns playlists for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchPlaylists = ({query = "", page = 0, limit = 50, exact = false}) => {
    exact = (exact) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=playlists&hide_search=1&filter=" + query;
    queryURL += "&exact=" + exact;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchPlaylists");
    return fetchPlaylistData(queryURL);
}

/**
 * Returns smartlists for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchSmartlists = ({query = "", page = 0, limit = 50, exact = false}) => {
    exact = (exact) ? 1 : 0;
    
    let queryURL = serverURL_value + "/server/json.server.php?action=playlists&filter=" + query;
    queryURL += "&exact=" + exact;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchSmartlists");
    return fetchPlaylistData(queryURL)
        .then((result) => {
            result = result.filter(function(item) {
                return item.id.match(/^smart_/);
            })

            return result;
        });
}