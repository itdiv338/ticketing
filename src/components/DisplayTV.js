// DisplayTV.js
import React, { useState, useEffect, useContext } from 'react';
import { QueueContext } from '../QueueContext';


const HospitalQueueDisplay = () => {
  const {
    queueData,
    currentDisplayPoli,
    announcements,
    poliNames,
    poliRooms
  } = useContext(QueueContext);
  const [currentTime, setCurrentTime] = useState(new Date());


  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const formatTime = (date) => {
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Ambil nomor antrian yang sedang dipanggil
  const getCurrentDisplayNumber = () => {
    const current = queueData[currentDisplayPoli];
    return current.prefix + ' ' + String(current.current).padStart(3, '0');
  };

  // Data untuk daftar antrian bawah
  const getQueueListData = () => {
    return Object.keys(queueData).map(key => ({
      label: poliNames[key].toUpperCase(),
      number: queueData[key].prefix + ' ' + String(queueData[key].current).padStart(3, '0')
    }));
  };

  // Complete styles including all animations and layouts
  const allStyles = `
    @keyframes glow {
      0% { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.3); }
      100% { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.5); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }
    .queue-number-glow {
      animation: glow 2s ease-in-out infinite alternate;
    }
    .pulse-animation {
      animation: pulse 2s ease-in-out infinite;
    }
    .blink-animation {
      animation: blink 1.5s ease-in-out infinite;
    }
    .container-main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: white;
      overflow-x: hidden;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #1d4ed8 50%, #2563eb 75%, #3b82f6 100%);
      font-family: 'Arial', sans-serif;
    }
    .time-display {
      position: fixed;
      top: 1rem;
      right: 2rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 1.125rem;
      font-weight: bold;
      z-index: 10;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      max-width: 112rem;
      margin: 0 auto;
      width: 100%;
    }
    .top-section {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
      height: 70vh;
    }
    .queue-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 1.5rem;
      text-align: center;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .status-dot {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      background: #118a15ff;
      border-radius: 50%;
    }
    .pulse-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0.25rem;
      background: linear-gradient(90deg, #4CAF50, #45a049, #4CAF50);
    }
    .queue-label {
      font-size: 2rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin-bottom: 1rem;
    }
    .queue-number {
      font-size: 6rem;
      font-weight: 900;
      margin: 1.875rem 0;
      letter-spacing: 0.2em;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
      transition: all 0.5s ease;
    }
    .queue-list-bottom {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 1rem;
      margin-right: 2rem;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      height: 20vh;
      display: flex;
      flex-direction: column;
    }
    .queue-list-title {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .queue-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      flex: 1;
    }
    .queue-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .queue-item:hover {
      transform: translateY(-0.125rem);
      background: rgba(255, 255, 255, 0.2);
    }
    .queue-item-label {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .queue-item-number {
      font-size: 1.8rem;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
    .video-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 1.5rem;
      margin-right: 2rem;
      padding: 1rem;
      color: #1f2937;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
      display: flex;
      flex-direction: column;
    }
    .video-placeholder {
      flex: 1;
      background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .video-placeholder iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 1rem;
    }
    
    @media (max-width: 1024px) {
      .top-section {
        grid-template-columns: 1fr;
        height: auto;
      }
      .queue-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .queue-number {
        font-size: 5rem;
      }
      .video-title {
        font-size: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .queue-number {
        font-size: 3.75rem;
      }
      .queue-label {
        font-size: 1.5rem;
      }
      .video-title {
        font-size: 1.5rem;
      }
      .main-content {
        padding: 1rem;
      }
      .time-display {
        top: 1rem;
        right: 1rem;
        font-size: 1rem;
        padding: 0.5rem 1rem;
      }
      .queue-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }
      .queue-item-number {
        font-size: 1.4rem;
      }
      .queue-list-title {
        font-size: 1.2rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: allStyles }} />
      <div className="container-main">
        {/* Time Display */}
        <div className="time-display">
          {formatTime(currentTime)}
        </div>
        {/* Main Content */}
        <div className="main-content">
          {/* Top Section with Queue Display and Video */}
          <div className="top-section">
            {/* Current Queue Section */}
            <div className="queue-section">
              {/* Status Indicator */}
              <div className="status-dot blink-animation"></div>
              {/* Pulse Bar */}
              <div className="pulse-bar pulse-animation"></div>
              <div className="queue-label">
                {poliNames[currentDisplayPoli]}
              </div>
              <div className="queue-number queue-number-glow">
                {getCurrentDisplayNumber()}
              </div>
            </div>
            {/* Video Section */}
            <div className="video-section">
              <div className="video-placeholder">
                <iframe 
                  src="https://www.youtube.com/embed/93yfxrwqGWw?si=FvTUWjBZEKjN7bVM" 
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
          {/* Bottom Queue List Section */}
          <div className="queue-list-bottom">
            <div className="queue-grid">
              {getQueueListData().map((queue, index) => (
                <div
                  key={index}
                  className="queue-item"
                >
                  <div className="queue-item-label">
                    {queue.label}
                  </div>
                  <div className="queue-item-number">
                    {queue.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalQueueDisplay;