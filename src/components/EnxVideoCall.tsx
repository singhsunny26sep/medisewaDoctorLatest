import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Enx from 'enx-rtc-react-native';

interface EnxVideoCallProps {
  token: string;
  roomId: string;
  onCallEnd?: () => void;
}

const EnxVideoCall: React.FC<EnxVideoCallProps> = ({
  token,
  roomId,
  onCallEnd,
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const enxRef = useRef<any>(null);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        
        const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        const audioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        
        if (!cameraGranted || !audioGranted) {
          Alert.alert('Permissions Required', 'Camera and microphone permissions are required for video calling');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Initialize Enx SDK
  const initializeEnx = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      // Initialize Enx
      await Enx.initialize({
        token: token,
        roomId: roomId,
        audio: true,
        video: true,
      });

      // Set up event listeners
      Enx.on('roomJoined', (data: any) => {
        console.log('Room joined:', data);
        setIsJoined(true);
        setParticipants(data.participants || []);
      });

      Enx.on('roomLeft', (data: any) => {
        console.log('Room left:', data);
        setIsJoined(false);
        setParticipants([]);
        onCallEnd?.();
      });

      Enx.on('participantJoined', (data: any) => {
        console.log('Participant joined:', data);
        setParticipants(prev => [...prev, data.participant]);
      });

      Enx.on('participantLeft', (data: any) => {
        console.log('Participant left:', data);
        setParticipants(prev => prev.filter(p => p.id !== data.participant.id));
      });

      Enx.on('audioToggled', (data: any) => {
        console.log('Audio toggled:', data);
      });

      Enx.on('videoToggled', (data: any) => {
        console.log('Video toggled:', data);
      });

      Enx.on('error', (error: any) => {
        console.error('Enx error:', error);
        Alert.alert('Error', error.message || 'An error occurred during the call');
      });

      // Join the room
      await Enx.joinRoom();
      
    } catch (error) {
      console.error('Failed to initialize Enx:', error);
      Alert.alert('Error', 'Failed to initialize video call');
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    try {
      if (isMuted) {
        await Enx.unmuteAudio();
        setIsMuted(false);
      } else {
        await Enx.muteAudio();
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    try {
      if (isVideoEnabled) {
        await Enx.disableVideo();
        setIsVideoEnabled(false);
      } else {
        await Enx.enableVideo();
        setIsVideoEnabled(true);
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  // Leave room
  const leaveRoom = async () => {
    try {
      await Enx.leaveRoom();
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  useEffect(() => {
    initializeEnx();

    // Cleanup on unmount
    return () => {
      if (isJoined) {
        Enx.leaveRoom();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call</Text>
      
      {!isJoined ? (
        <View style={styles.loadingContainer}>
          <Text>Joining room...</Text>
        </View>
      ) : (
        <View style={styles.callContainer}>
          {/* Video View - You can customize this based on your UI needs */}
          <View style={styles.videoContainer}>
            <Text style={styles.participantCount}>
              Participants: {participants.length + 1}
            </Text>
          </View>

          {/* Control buttons */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.mutedButton]}
              onPress={toggleAudio}
            >
              <Text style={styles.controlButtonText}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoEnabled && styles.disabledButton]}
              onPress={toggleVideo}
            >
              <Text style={styles.controlButtonText}>
                {isVideoEnabled ? 'Hide Video' : 'Show Video'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.endCallButton]}
              onPress={leaveRoom}
            >
              <Text style={styles.controlButtonText}>End Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantCount: {
    color: '#fff',
    fontSize: 18,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EnxVideoCall;
