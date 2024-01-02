import {useState} from "react";

export default function useGamePlayers() {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  return {
    showAddPlayer,
    setShowAddPlayer
  };
}
