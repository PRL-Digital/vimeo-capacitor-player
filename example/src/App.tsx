import { useState, useEffect } from "react";
import { VideoNativeBridge } from "vimeo-capacitor-player";
import type {
  VideoPlayerInfo,
  PlaybackState,
  VideoTimeInfo,
} from "vimeo-capacitor-player";
import "./App.css";

// Preset Vimeo video URL - Replace with your own video ID
const VIMEO_VIDEO_ID = "76979871";
const VIMEO_URL = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}`;

interface EventLog {
  timestamp: Date;
  event: string;
  data?: any;
}

function App() {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [playerState, setPlayerState] = useState<PlaybackState | null>(null);

  useEffect(() => {
    // Add event listeners for video player
    const listeners: any[] = [];

    const setupListeners = async () => {
      // Listen for when native video player opens
      const openedListener = await VideoNativeBridge.addListener(
        "videoPlayerOpened",
        (info: VideoPlayerInfo) => {
          addLog("videoPlayerOpened", info);
          setIsPlayerActive(true);
        }
      );
      listeners.push(openedListener);

      // Listen for when native video player closes
      const closedListener = await VideoNativeBridge.addListener(
        "videoPlayerClosed",
        () => {
          addLog("videoPlayerClosed");
          setIsPlayerActive(false);
          setPlayerState(null);
        }
      );
      listeners.push(closedListener);

      // Listen for playback state changes
      const stateListener = await VideoNativeBridge.addListener(
        "videoPlaybackStateChanged",
        (state: PlaybackState) => {
          addLog("videoPlaybackStateChanged", state);
          setPlayerState(state);
        }
      );
      listeners.push(stateListener);

      // Listen for time updates
      const timeListener = await VideoNativeBridge.addListener(
        "videoTimeUpdated",
        (time: VideoTimeInfo) => {
          // Only log every few seconds to avoid spam
          if (Math.floor(time.currentTime) % 5 === 0) {
            addLog("videoTimeUpdated", time);
          }
        }
      );
      listeners.push(timeListener);
    };

    setupListeners();

    // Cleanup listeners on unmount
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  const addLog = (event: string, data?: any) => {
    setEventLogs((prev) => [
      { timestamp: new Date(), event, data },
      ...prev.slice(0, 49), // Keep last 50 logs
    ]);
  };

  const clearLogs = () => {
    setEventLogs([]);
  };

  const checkPlayerActive = async () => {
    try {
      const result = await VideoNativeBridge.isNativePlayerActive();
      addLog("isNativePlayerActive", result);
      setIsPlayerActive(result.active);
    } catch (error) {
      addLog("error", { method: "isNativePlayerActive", error: String(error) });
    }
  };

  const getPlayerState = async () => {
    try {
      const state = await VideoNativeBridge.getPlayerState();
      addLog("getPlayerState", state);
      setPlayerState(state);
    } catch (error) {
      addLog("error", { method: "getPlayerState", error: String(error) });
    }
  };

  const handlePlay = async () => {
    try {
      await VideoNativeBridge.play();
      addLog("play command sent");
    } catch (error) {
      addLog("error", { method: "play", error: String(error) });
    }
  };

  const handlePause = async () => {
    try {
      await VideoNativeBridge.pause();
      addLog("pause command sent");
    } catch (error) {
      addLog("error", { method: "pause", error: String(error) });
    }
  };

  const handleSeek = async (time: number) => {
    try {
      await VideoNativeBridge.seek({ time });
      addLog("seek command sent", { time });
    } catch (error) {
      addLog("error", { method: "seek", error: String(error) });
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Vimeo Capacitor Player Example</h1>
        <p>Test the Video Native Bridge plugin with a Vimeo video</p>
      </header>

      <main>
        <section className="video-section">
          <h2>Vimeo Video Player</h2>
          <div className="video-container">
            <iframe
              src={VIMEO_URL}
              width="100%"
              height="360"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo Video"
            ></iframe>
          </div>
          <p className="hint">
            Tap the video to play. On iOS, it will trigger the native video
            player.
          </p>
        </section>

        <section className="controls-section">
          <h2>Plugin Controls</h2>
          <div className="controls">
            <button onClick={checkPlayerActive}>Check Player Active</button>
            <button onClick={getPlayerState} disabled={!isPlayerActive}>
              Get Player State
            </button>
            <button onClick={handlePlay} disabled={!isPlayerActive}>
              Play
            </button>
            <button onClick={handlePause} disabled={!isPlayerActive}>
              Pause
            </button>
            <button onClick={() => handleSeek(30)} disabled={!isPlayerActive}>
              Seek to 30s
            </button>
          </div>

          {playerState && (
            <div className="player-state">
              <h3>Current State:</h3>
              <p>Playing: {playerState.isPlaying ? "▶️ Yes" : "⏸️ No"}</p>
              <p>
                Time: {playerState.currentTime.toFixed(2)}s /{" "}
                {playerState.duration.toFixed(2)}s
              </p>
            </div>
          )}
        </section>

        <section className="logs-section">
          <div className="logs-header">
            <h2>Event Logs</h2>
            <button onClick={clearLogs} className="clear-btn">
              Clear Logs
            </button>
          </div>
          <div className="logs">
            {eventLogs.length === 0 ? (
              <p className="no-logs">
                No events yet. Interact with the video to see logs.
              </p>
            ) : (
              eventLogs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="log-event">{log.event}</span>
                  {log.data && (
                    <pre className="log-data">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
