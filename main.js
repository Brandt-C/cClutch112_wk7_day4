// let's set up a function to get our access token
const getAuth = async () => {

    const response = await fetch('https://accounts.spotify.com/api/token',
    {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(clientID + ':' + clientSecret)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
    });
    const token = await response.json();
    console.log(token)
    return token.access_token
}
// getAuth()

//  Make a function to make an api call
const getSong = async (songname, artist, token) => {
    // const token = await getAuth();
    let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${songname}+artist:${artist}`,
    {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    let data = await response.json();
    // console.log(data);
    // console.log(data.tracks.items[0])
    return data.tracks.items[0]
}
// getSong("you don't know my name", "alicia keys")


// set up an array of songs as a global variable
let music =[{id: 0, track: 'Electric Worry', artist: 'Clutch' },
{id: 1, track: 'Pardon Me', artist: 'Incubus' },
{id: 2, track: 'TNT', artist: 'AC-DC' },
{id: 3, track: 'Burden in my hand', artist: 'Soundgarden' },
{id: 4, track: 'Rats', artist: 'Pearl Jam' },
{id: 5, track: 'Black', artist: 'Sevendust' },
{id: 6, track: 'Bother', artist: 'Stone Sour' },
{id: 7, track: 'The ghost of tom joad', artist: 'Rage against the machine' },
{id: 8, track: 'Sleep now in the fire', artist: 'Rage against the machine' }];
// gives us the ability to track what's playing

let playing; //TODO
let stopbtn = document.getElementById('stopbtn');
let headertitle = document.getElementById('headertitle');

// set up the function/ process that loads everything when the page loads!
const setupTrackList = async () => {
    const token = await getAuth();
    // once we get our token, loop through 'music'
    for (let i=0; i < music.length; i++){
        let data = await getSong(music[i].track, music[i].artist, token);
        // console.log(data);
        music[i]['preview_url'] = new Audio(data.preview_url);
        music[i]['album_cover'] = data.album.images[0].url;
        // put it into the html!
        let img = document.getElementById(`${i}`);
        img.src = music[i].album_cover
        img.hidden = false
    }console.log(music)
}
setupTrackList()

let clickEvent = (id) => {
    console.log(id);
    let track = music[id.slice(-1)];
    console.log(track);
    if (playing && !playing.preview_url.paused){
        if (playing == track){
            pauseTrack();
            return
        }
        // what if this is a different song?
        else {
            playing.preview_url.pause();
            let playingbtn = document.getElementById(`playbtn${playing.id}`);
            playingbtn.innerHTML = "Play";
        }
    }
    
    // playing the audio
    console.log(`Playing ${track.track} by ${track.artist}`);
    track.preview_url.play();
    playing = track;

    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = "Pause";
    
    // put in the headertitle
    headertitle.innerHTML = `${track.track} | ${track.artist}`;
}

// pause btn func
let pauseTrack = () => {
    console.log('PAUSED');
    playing.preview_url.pause();
    let playingbtn = document.getElementById(`playbtn${playing.id}`);
    playingbtn.innerHTML = "Play";
    headertitle.innerHTML = "Clutch | SpottyAPI Music"
}
