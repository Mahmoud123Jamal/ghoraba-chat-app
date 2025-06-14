export const initializeAudioContext = () => {
    const handleUserInteraction = () => {
      try {
        // Create and play silent audio to unlock audio context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        
        // Create an empty buffer
        const buffer = context.createBuffer(1, 1, 22050);
        const source = context.createBufferSource();
        source.buffer = buffer;
        
        // Connect to output
        source.connect(context.destination);
        
        // Play the empty buffer
        if (source.start) {
          source.start(0);
        } else if ((source as any).play) {
          (source as any).play(0);
        }
        
        // Clean up
        source.onended = () => {
          source.disconnect();
          context.close();
        };
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      } catch (e) {
        console.warn("Audio context initialization failed", e);
      }
    };
  
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
  };