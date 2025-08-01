      // Force re-render jika context berubah
      // (tidak perlu set state, cukup trigger render)





// AppA - tiket.js
import React, { useState, useEffect, useContext } from 'react';
import { QueueContext } from '../QueueContext';



const HospitalQueueSystem = () => {
  const [selectedPoli, setSelectedPoli] = useState(null);
  const [pendingPoli, setPendingPoli] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ambil context antrian
  const { queueData, setQueueData } = useContext(QueueContext);


  // Ambil nomor antrian dari context agar selalu sinkron
  const getQueueNumberFromContext = (poli) => queueData[poli].total;

  const poliNames = {
    umum: 'Poli Umum',
    anak: 'Poli Anak',
    gigi: 'Poli Gigi',
    ptm: 'PTM (Penyakit Tidak Menular)'
  };

  const poliIcons = {
    umum: '👩‍⚕️',
    anak: '👶',
    gigi: '🦷',
    ptm: '❤️'
  };

  const poliDescriptions = {
    umum: 'Pelayanan kesehatan umum untuk semua keluhan',
    anak: 'Pelayanan kesehatan khusus anak-anak',
    gigi: 'Pelayanan kesehatan gigi dan mulut',
    ptm: 'Pelayanan penyakit tidak menular'
  };

  const poliData = [
    { id: 'umum', name: 'Poli Umum', icon: '👩‍⚕️', className: 'poli-umum', color: '#5BA3E0' },
    { id: 'anak', name: 'Poli Anak', icon: '👶', className: 'poli-anak', color: '#FF9C42' },
    { id: 'ptm', name: 'PTM', icon: '❤️', className: 'poli-ptm', color: '#FF6B6B' },
    { id: 'gigi', name: 'Poli Gigi', icon: '🦷', className: 'poli-gigi', color: '#E649C5' }
  ];

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setCurrentDate(now.toLocaleString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectPoli = (poli) => {
    if (isLoading) return;
    setPendingPoli(poli);
    setShowModal(true);
  };

  const confirmSelection = (confirmed) => {
    setShowModal(false);
    
    if (confirmed && pendingPoli) {
      setSelectedPoli(pendingPoli);
    }
    
    setPendingPoli(null);
  };

  const getQueueNumber = () => {
    if (!selectedPoli || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      // Update context queueData: total dan waiting bertambah 1
      setQueueData(prev => ({
        ...prev,
        [selectedPoli]: {
          ...prev[selectedPoli],
          total: prev[selectedPoli].total + 1,
          waiting: prev[selectedPoli].waiting + 1
        }
      }));
      setIsLoading(false);
      setTimeout(() => {
        setShowResult(true);
      }, 300);
    }, 1500);
  };

  const resetSelection = () => {
    setSelectedPoli(null);
    setPendingPoli(null);
    setShowResult(false);
    setIsLoading(false);
  };

  const formatQueueNumber = (poli) => {
    return `${poli.charAt(0).toUpperCase()}${String(getQueueNumberFromContext(poli)).padStart(3, '0')}`;
  };

  const getEstimatedWaitTime = (poli) => {
    const nomorTerakhir = getQueueNumberFromContext(poli);
    const remaining = nomorTerakhir - 1;
    const estimatedMinutes = remaining * 8; // 8 minutes per patient
    if (estimatedMinutes <= 0) return 'Sedang dilayani';
    if (estimatedMinutes < 60) return `~${estimatedMinutes} menit`;
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    return `~${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <style jsx>{`
        .container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08);
          padding: 0px;
          margin-bottom: 20px;
          max-width: 1400px;
          width: 100%;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin-top: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 40px;
          font-weight: bold;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .header-info {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 15px;
          margin: 20px 0 30px;
          font-size: 16px;
          font-weight: 500;
        }
        
        .poli-selection {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .poli-selection.hidden {
          opacity: 0;
          visibility: hidden;
          height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .poli-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto 30px;
        }
        
        .poli-card {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 15px 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(5px);
          overflow: hidden;
        }
        
        .poli-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color, #ccc);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .poli-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color, #5BA3E0);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 1);
        }
        
        .poli-card:hover::before {
          opacity: 1;
        }
        
        .poli-card.selected {
          transform: translateY(-5px);
          border-color: var(--card-color, #5BA3E0);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .poli-card.selected::before {
          opacity: 1;
        }
        
        .poli-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          background: var(--card-color, #ccc);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .poli-name {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
        }
        
        .poli-description {
          font-size: 12px;
          color: #718096;
          margin-bottom: 12px;
          line-height: 1.4;
          text-align: center;
        }
        
        .poli-queue {
          font-size: 14px;
          color: #4a5568;
          font-weight: 600;
        }
        
        .poli-wait-time {
          font-size: 12px;
          color: #a0aec0;
          margin-top: 4px;
        }
        
        .get-number-btn {
          background: linear-gradient(135deg, #a8a8a8, #909090);
          color: white;
          border: none;
          padding: 20px 60px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 20px;
          position: relative;
          overflow: hidden;
          min-width: 280px;
        }
        
        .get-number-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .get-number-btn:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .get-number-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #48bb78, #38a169);
          box-shadow: 0 12px 30px rgba(72, 187, 120, 0.4);
        }
        
        .get-number-btn:disabled {
          cursor: not-allowed;
          transform: none;
        }
        
        .get-number-btn.enabled {
          background: linear-gradient(135deg, #48bb78, #38a169);
          box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
        }
        
        .get-number-btn.loading {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .queue-result {
          transform: scale(0) rotate(10deg);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          margin: 40px 0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .queue-result.show {
          transform: scale(1) rotate(0deg);
          opacity: 1;
          position: static;
        }
        
        .queue-number {
          background: linear-gradient(135deg, #2d3748, #1a202c);
          color: white;
          padding: 50px 40px;
          border-radius: 25px;
          margin: 30px 0;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .queue-number::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #4299e1, #48bb78, #ed8936, #e53e3e);
        }
        
        .queue-number h2 {
          font-size: 22px;
          margin-bottom: 25px;
          font-weight: 600;
          opacity: 0.9;
        }
        
        .number-display {
          font-size: 80px;
          font-weight: 900;
          margin: 25px 0;
          letter-spacing: 12px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .queue-info {
          font-size: 18px;
          margin-bottom: 35px;
          line-height: 1.6;
        }
        
        .queue-info strong {
          font-size: 20px;
          color: #90cdf4;
        }
        
        .reset-btn {
          background: linear-gradient(135deg, #e53e3e, #c53030);
          color: white;
          border: none;
          padding: 18px 40px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(229, 62, 62, 0.3);
        }
        
        .reset-btn:hover {
          background: linear-gradient(135deg, #c53030, #9c2626);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
        }
        
        .modal {
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.4s ease;
        }
        
        .modal-content {
          background: white;
          border-radius: 25px;
          padding: 45px;
          text-align: center;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          animation: modalScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .modal-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          margin: 0 auto 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 45px;
          color: white;
          background: linear-gradient(135deg, #667eea, #764ba2);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .modal-title {
          font-size: 26px;
          color: #2d3748;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .modal-message {
          font-size: 18px;
          color: #4a5568;
          margin-bottom: 35px;
          line-height: 1.5;
        }
        
        .modal-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .modal-btn {
          padding: 18px 35px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }
        
        .modal-btn-yes {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
        }
        
        .modal-btn-yes:hover {
          background: linear-gradient(135deg, #38a169, #2f855a);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
        }
        
        .modal-btn-no {
          background: linear-gradient(135deg, #e53e3e, #c53030);
          color: white;
          box-shadow: 0 6px 20px rgba(229, 62, 62, 0.3);
        }
        
        .modal-btn-no:hover {
          background: linear-gradient(135deg, #c53030, #9c2626);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalScale {
          from { transform: scale(0.5) rotate(10deg); }
          to { transform: scale(1) rotate(0deg); }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 25px;
            margin: 10px;
          }
          
          .poli-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            max-width: 400px;
          }
          
          .poli-card {
            min-height: 160px;
          }
          
          .get-number-btn {
            padding: 18px 40px;
            font-size: 16px;
            min-width: 240px;
          }
          
          .number-display {
            font-size: 60px;
            letter-spacing: 8px;
          }
          
          .modal-content {
            padding: 35px 25px;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .poli-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 600px;
          }
          
          .poli-card {
            min-height: 160px;
            padding: 20px 15px;
          }
        }
        
        @media (min-width: 1025px) and (max-width: 1200px) {
          .poli-grid {
            max-width: 1000px;
          }
          
          .poli-card {
            min-height: 170px;
          }
        }
      `}</style>
      
      <div className="container">
        <div className="header" style={{ marginBottom: '10px' }}>
          <div className="logo">🏥</div>
          <h1 style={{ fontSize: '36px', color: '#2d3748', marginBottom: '15px', fontWeight: '800' }}>
            Sistem Antrian RS Digital
          </h1>
          <p style={{ fontSize: '18px', color: '#718096', marginBottom: '10px' }}>
            Ambil nomor antrian dengan mudah dan cepat
          </p>
          <div className="header-info">
            📅 {currentDate} • ⏰ {currentTime}
          </div>
        </div>
        
        <div className={`poli-selection ${showResult ? 'hidden' : ''}`}>
          <div className="poli-grid">
            {poliData.map((poli) => (
              <div 
                key={poli.id}
                className={`poli-card ${poli.className} ${selectedPoli === poli.id ? 'selected' : ''}`}
                style={{ '--card-color': poli.color }}
                onClick={() => selectPoli(poli.id)}
              >
                <div className="poli-icon" style={{ background: poli.color }}>
                  {poli.icon}
                </div>
                <div className="poli-name">{poli.name}</div>
                <div className="poli-description">{poliDescriptions[poli.id]}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`queue-result ${showResult ? 'show' : ''}`}>
          <div className="queue-number">
            <h2>🎫 Nomor Antrian Anda</h2>
            <div className="number-display">
              {selectedPoli ? formatQueueNumber(selectedPoli) : '-'}
            </div>
            <div className="queue-info">
              <strong>{selectedPoli ? poliNames[selectedPoli] : '-'}</strong><br />
              📅 {currentDate}<br />
              ⏰ Diambil pada: {currentTime}<br />
              ⏳ Estimasi tunggu: {selectedPoli ? getEstimatedWaitTime(selectedPoli) : '-'}
            </div>
            <button className="reset-btn" onClick={resetSelection}>
              🔄 Ambil Nomor Baru
            </button>
          </div>
        </div>
        
        {/* Modal Confirmation */}
        {showModal && (
          <div className="modal" onClick={(e) => e.target.className === 'modal' && confirmSelection(false)}>
            <div className="modal-content">
              <div className="modal-icon">
                {pendingPoli ? poliIcons[pendingPoli] : '❓'}
              </div>
              <div className="modal-title">Konfirmasi Pilihan</div>
              <div className="modal-message">
                Apakah Anda yakin ingin mengambil nomor antrian untuk<br />
                <strong>{pendingPoli ? poliNames[pendingPoli] : ''}?</strong>
              </div>
              <div className="modal-buttons">
                <button 
                  className="modal-btn modal-btn-yes" 
                  onClick={() => confirmSelection(true)}
                >
                  ✅ Ya, Ambil
                </button>
                <button 
                  className="modal-btn modal-btn-no" 
                  onClick={() => confirmSelection(false)}
                >
                  ❌ Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalQueueSystem;