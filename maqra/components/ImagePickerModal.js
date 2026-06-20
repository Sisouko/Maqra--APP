import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES } from '../lib/theme';
import { TRANSLATIONS } from '../lib/localization';

export default function ImagePickerModal({ isVisible, onClose, onSelectImage, aspect = [1, 1], language = 'fr' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const isRtl = language === 'ar';

  const handleLaunchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(language === 'ar' ? 'نحتاج إلى إذن الكاميرا لالتقاط صورة!' : "Nous avons besoin de la permission caméra pour prendre une photo !");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        onSelectImage(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.log('Error launching camera:', error);
    }
  };

  const handleLaunchLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert(language === 'ar' ? 'نحتاج إلى إذن معرض الصور لاختيار صورة!' : "Nous avons besoin de la permission galerie pour choisir une photo !");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        onSelectImage(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.log('Error launching library:', error);
    }
  };

  const rowStyle = { flexDirection: isRtl ? 'row-reverse' : 'row' };
  const textAlignStyle = { textAlign: isRtl ? 'right' : 'left' };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.contentCard} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.title, textAlignStyle]}>{t.chooseSourceTitle}</Text>
            
            <View style={styles.optionsContainer}>
              {/* Camera Option */}
              <TouchableOpacity style={[styles.optionButton, rowStyle]} onPress={handleLaunchCamera}>
                <Text style={styles.optionIcon}>📸</Text>
                <Text style={styles.optionText}>{t.cameraOption}</Text>
              </TouchableOpacity>

              {/* Gallery Option */}
              <TouchableOpacity style={[styles.optionButton, rowStyle]} onPress={handleLaunchLibrary}>
                <Text style={styles.optionIcon}>🖼️</Text>
                <Text style={styles.optionText}>{t.galleryOption}</Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  contentCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.xl,
    paddingBottom: 35,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
  },
  title: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    color: COLORS.textPrimary,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: SPACING.lg,
  },
  optionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderRadius: SHAPES.buttonRadius,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
});
