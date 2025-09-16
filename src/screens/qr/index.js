import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp, hp } from '../../constant';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [scannedData, setScannedData] = useState(null);
  const [reply, setReply] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // Handle QR Code Scanned
  const onSuccess = async e => {
    try {
      const url = e.data; // e.g. https://mm.workbrink.com/menu?restaurant_id=mm-a5f415ee
      const restaurantId = new URL(url).searchParams.get('restaurant_id');

      if (!restaurantId) {
        Alert.alert('Invalid QR Code');
        return;
      }

      setScannedData(restaurantId);

      // Navigate to chat screen with restaurant ID
      console.log('Restaurant ID extracted:', restaurantId);
      navigation.navigate('Chat', { restaurantId: restaurantId });
    } catch (error) {
      console.error(error);
      Alert.alert('Error scanning QR code');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/MenuMindLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Scan Restaurant QR Code</Text>
        </View>
        <View style={styles.qrIcon}>
          <Image
            source={require('../../assets/images/Qr.png')}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Main Content */}
      {!showCamera ? (
        <View style={styles.mainContent}>
          {/* QR Card */}
          <View style={styles.qrCard}>
            <View style={styles.cameraIconContainer}>
              <Image
                source={require('../../assets/images/camera.png')}
                style={styles.cameralogo}
              />
            </View>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanDescription}>
              Scan your table's QR code to start chatting with the restaurant's
              AI assistant.
            </Text>
            <TouchableOpacity
              style={styles.openCameraButton}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.openCameraText}>Open Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Results */}
          {scannedData && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                ✅ Restaurant ID: {scannedData}
              </Text>
              {reply && <Text style={styles.replyText}>{reply}</Text>}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            topContent={
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.cameraInstruction}>
                  Point your camera at the restaurant QR code
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default QRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(2),
    resizeMode: 'contain',
  },
  cameralogo: {
    width: wp(13),
    height: wp(12),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#000',
  },
  qrIcon: {
    padding: wp(2),
  },
  qrIconText: {
    fontSize: wp(6),
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(6),
    alignItems: 'center',
  },
  cameraIconContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  cameraIcon: {
    fontSize: wp(8),
    color: '#4A90E2',
  },
  scanTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp(1),
  },
  scanDescription: {
    fontSize: wp(4),
    color: '#666',
    textAlign: 'center',
    lineHeight: wp(5),
    marginBottom: hp(3),
  },
  openCameraButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: 25,
    minWidth: wp(40),
  },
  openCameraText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: wp(4),
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: wp(4),
    top: wp(4),
    padding: wp(2),
  },
  backButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
  },
  cameraInstruction: {
    color: '#fff',
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(2),
  },
  resultBox: {
    marginTop: hp(3),
    padding: wp(4),
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: wp(4),
    marginBottom: hp(1),
    color: '#333',
    fontWeight: '600',
  },
  replyText: {
    fontSize: wp(3.8),
    color: '#000',
    textAlign: 'center',
    lineHeight: wp(5),
  },
});
