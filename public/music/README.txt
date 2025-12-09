===============================================
        HOW TO ADD SONGS TO THE PLAYER
===============================================

1. Copy your audio files (.mp3, .ogg, .wav) into this folder:
   public/music/

2. Open playlist.json and add your song to the "songs" array:

   Example:
   {
     "songs": [
       {
         "id": "default",
         "name": "Retro Gaming",
         "file": "https://cdn.pixabay.com/audio/2022/03/10/audio_4a3c2c0a8f.mp3"
       },
       {
         "id": "my-song",
         "name": "My Cool Song",
         "file": "/music/my-cool-song.mp3"
       },
       {
         "id": "another-song",
         "name": "Another Track",
         "file": "/music/another-track.mp3"
       }
     ]
   }

3. Each song needs:
   - id: unique identifier (no spaces, use dashes)
   - name: display name in the player
   - file: path to the file (use /music/filename.mp3 for local files)

4. Save and refresh the page - your songs will appear in the player!

===============================================

