import { useState, useEffect } from "react";
import url from "./assets/sounds/clearly.mp3";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  //   const [playing, setPlaying] = useState(false);

  //   const toggle = () => setPlaying(!playing);

  //   useEffect(() => {
  //     playing ? audio.play() : audio.pause();
  //   }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended");
    return () => {
      audio.removeEventListener("ended");
    };
  }, []);

  return audio;
};

const Player = () => {
  const audio = useAudio(url);

  return audio;
};

export default Player;
