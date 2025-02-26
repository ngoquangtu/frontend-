import React from 'react';

interface ToggleSwitchProps {
    state: 'ENABLED' | 'PAUSED'; 
    setState: (newState: 'ENABLED' | 'PAUSED') => void; 
    enabledLabel?: string; 
    disabledLabel?: string; 
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
    state, 
    setState, 
    enabledLabel = 'ENABLED', 
    disabledLabel = 'PAUSED' 
}) => {
    const handleToggle = () => {
        setState(state === 'ENABLED' ? 'PAUSED' : 'ENABLED');
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            {/* Toggle Switch */}
            <div
                onClick={handleToggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    width: '40px',
                    height: '20px',
                    backgroundColor: state === 'ENABLED' ? '#4caf50' : '#f44336',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s ease',
                }}
            >
                {/* Switch Knob */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: state === 'ENABLED' ? '22px' : '2px',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        transition: 'left 0.3s ease',
                    }}
                ></div>
            </div>

            {/* State Label */}
            <span
                style={{
                    marginLeft: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: state === 'ENABLED' ? '#4caf50' : '#f44336',
                    textTransform: 'uppercase',
                }}
            >
                {state === 'ENABLED' ? enabledLabel : disabledLabel}
            </span>
        </div>
    );
};

export default ToggleSwitch;
