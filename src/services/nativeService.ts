import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';

export class NativeService {
  private static instance: NativeService;
  private constructor() {}

  public static getInstance(): NativeService {
    if (!NativeService.instance) {
      NativeService.instance = new NativeService();
    }
    return NativeService.instance;
  }

  async checkPermissions(): Promise<boolean> {
    try {
      // Check camera permissions
      const cameraPermissions = await Camera.checkPermissions();
      if (cameraPermissions.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      // Check microphone permissions
      const voicePermissions = await VoiceRecorder.hasAudioRecordingPermission();
      if (!voicePermissions.value) {
        await VoiceRecorder.requestAudioRecordingPermission();
      }

      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  async takePicture(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      return image.webPath || null;
    } catch (error) {
      console.error('Camera error:', error);
      return null;
    }
  }

  async pickImage(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      return image.webPath || null;
    } catch (error) {
      console.error('Gallery error:', error);
      return null;
    }
  }

  async startVoiceRecording(): Promise<void> {
    try {
      await VoiceRecorder.startRecording();
    } catch (error) {
      console.error('Voice recording error:', error);
      throw error;
    }
  }

  async stopVoiceRecording(): Promise<string> {
    try {
      const recording = await VoiceRecorder.stopRecording();
      const audioFile = recording.value.recordDataBase64;
      
      if (!audioFile) {
        throw new Error('No audio data received from recording');
      }

      // Save the audio file
      const fileName = `recording-${Date.now()}.wav`;
      await Filesystem.writeFile({
        path: fileName,
        data: audioFile,
        directory: Directory.Cache
      });

      return fileName;
    } catch (error) {
      console.error('Voice recording error:', error);
      throw error;
    }
  }

  async saveImage(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);
      
      const fileName = `image-${Date.now()}.${blob.type.split('/')[1]}`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      return fileName;
    } catch (error) {
      console.error('File saving error:', error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
} 