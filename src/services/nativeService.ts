import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';

export class NativeService {
  private static instance: NativeService;
  private isInitialized: boolean = false;
  private permissionsChecked: boolean = false;

  private constructor() {}

  public static getInstance(): NativeService {
    if (!NativeService.instance) {
      NativeService.instance = new NativeService();
    }
    return NativeService.instance;
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.checkPermissions();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize NativeService:', error);
      throw new Error('Failed to initialize camera services');
    }
  }

  async checkPermissions(): Promise<boolean> {
    if (this.permissionsChecked) return true;

    try {
      // Check camera permissions
      const cameraPermissions = await Camera.checkPermissions();
      if (cameraPermissions.camera !== 'granted') {
        const requested = await Camera.requestPermissions();
        if (requested.camera !== 'granted') {
          throw new Error('Camera permission denied');
        }
      }

      // Check microphone permissions
      const voicePermissions = await VoiceRecorder.hasAudioRecordingPermission();
      if (!voicePermissions.value) {
        const requested = await VoiceRecorder.requestAudioRecordingPermission();
        if (!requested.value) {
          throw new Error('Microphone permission denied');
        }
      }

      this.permissionsChecked = true;
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      this.permissionsChecked = false;
      throw error;
    }
  }

  async takePicture(): Promise<string> {
    try {
      await this.initialize();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, // Disable editing to make it instant
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear,
        presentationStyle: 'fullscreen',
        promptLabelHeader: 'Take a photo',
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'Choose from Library',
        promptLabelPicture: 'Take Picture',
        width: 1920,
        height: 1080,
        correctOrientation: true,
        saveToGallery: false
      });

      if (!image.webPath) {
        throw new Error('Failed to capture image');
      }

      return image.webPath;
    } catch (error) {
      console.error('Camera error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to capture image');
    }
  }

  async pickImage(): Promise<string> {
    try {
      await this.initialize();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 1920,
        height: 1080,
        correctOrientation: true
      });

      if (!image.webPath) {
        throw new Error('Failed to pick image from gallery');
      }

      return image.webPath;
    } catch (error) {
      console.error('Gallery error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to pick image from gallery');
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

  async saveImage(imageUrl: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true
      });

      return savedFile.uri;
    } catch (error) {
      console.error('Save image error:', error);
      throw new Error('Failed to save image');
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
} 