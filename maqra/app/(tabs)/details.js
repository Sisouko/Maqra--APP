import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useBookStore } from '../../store/useBookStore';
import { useReadingTimer } from '../../hooks/useReadingTimer';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function DetailsScreen() {
  const { books, selectedBookId, updateBookProgress, deleteBook, updateBookCover, addReadingSession } = useBookStore();
  
  // Get currently selected book, or default to the first one in the list
  const book = books.find(b => b.id === selectedBookId) || books[0];
  
  const [currentPageInput, setCurrentPageInput] = useState('');
  
  // Timer Hook
  const { seconds, isActive, startTimer, pauseTimer, stopTimer } = useReadingTimer();
  
  // Session modal state
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [pagesReadInput, setPagesReadInput] = useState('10');

  // Sync state input when book selection changes
  useEffect(() => {
    if (book) {
      setCurrentPageInput(String(book.currentPage));
    }
  }, [book]);

  if (!book) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun livre disponible. Commencez par ajouter un livre dans l'onglet Bibliothèque !</Text>
      </View>
    );
  }

  const progressPercentage = book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;

  const handleUpdatePage = () => {
    const val = Number(currentPageInput);
    if (isNaN(val) || val < 0 || val > book.pages) return;
    updateBookProgress(book.id, val);
  };

  const handleToggleCompleted = () => {
    if (book.status === 'terminé') {
      updateBookProgress(book.id, 0, 'à lire');
    } else {
      updateBookProgress(book.id, book.pages, 'terminé');
    }
  };

  // Change Book Cover Photo
  const handleChangeCover = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' && libraryPermission.status !== 'granted') {
      alert("Nous avons besoin des permissions d'accès aux photos et à la caméra pour changer la couverture !");
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        updateBookCover(book.id, result.assets[0].uri);
      }
    } catch (e) {
      // Fallback
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        updateBookCover(book.id, result.assets[0].uri);
      }
    }
  };

  // Stopwatch Session Actions
  const handleEndSession = () => {
    const elapsedSeconds = stopTimer();
    if (elapsedSeconds <= 0) return;
    setSessionDuration(elapsedSeconds);
    setIsSessionModalVisible(true);
  };

  const handleSaveSession = () => {
    const addedPages = Number(pagesReadInput) || 0;
    
    // Save reading session in store
    addReadingSession({
      bookId: book.id,
      durationSeconds: sessionDuration,
      pagesRead: addedPages,
    });

    // Update book progress
    const newPage = Math.min(book.pages, book.currentPage + addedPages);
    updateBookProgress(book.id, newPage);

    setIsSessionModalVisible(false);
    setPagesReadInput('10');
  };

  // Format MM:SS
  const formatStopwatch = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Star builder helper
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push('⭐');
      } else if (i - 0.5 <= rating) {
        stars.push('⯪');
      }
    }
    return stars.join(' ') + ` (${rating})`;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{book.title}</Text>
            <Text style={styles.headerSubtitle}>{book.author}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => deleteBook(book.id)}>
            <Text style={[styles.headerIcon, { color: COLORS.secondary }]}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* BOOK HERO CARD */}
        <View style={styles.heroCard}>
          {/* Glow halo & cover photo picker */}
          <TouchableOpacity style={styles.coverWrapper} onPress={handleChangeCover}>
            <View style={styles.glowHalo} />
            {book.coverPhoto ? (
              <Image source={{ uri: book.coverPhoto }} style={styles.coverImage} />
            ) : (
              <View style={[styles.coverImagePlaceholder, { borderColor: book.status === 'terminé' ? COLORS.tertiary : COLORS.primary }]}>
                <Text style={styles.coverArabicTitle}>{book.title}</Text>
                <Text style={styles.coverAuthor}>{book.author.split(' ').pop()}</Text>
                <View style={styles.editCoverIndicator}>
                  <Text style={styles.editCoverText}>📸</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>{book.language}</Text>
            </View>
            <Text style={styles.ratingText}>{renderStars(book.rating)}</Text>
          </View>

          <Text style={styles.totalPages}>{book.pages} pages</Text>

          <View style={styles.statusRow}>
            <View style={[styles.pillBadge, { 
              backgroundColor: book.status === 'terminé' ? COLORS.tertiary + '20' : book.status === 'en cours' ? COLORS.primary + '20' : COLORS.border,
              borderColor: book.status === 'terminé' ? COLORS.tertiary : book.status === 'en cours' ? COLORS.primary : COLORS.border
            }]}>
              <Text style={[styles.pillBadgeText, { 
                color: book.status === 'terminé' ? COLORS.tertiary : book.status === 'en cours' ? COLORS.primary : COLORS.textSecondary 
              }]}>
                {book.status}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.outlineButton, { borderColor: book.status === 'terminé' ? COLORS.secondary : COLORS.tertiary }]} 
              onPress={handleToggleCompleted}
            >
              <Text style={[styles.outlineButtonText, { color: book.status === 'terminé' ? COLORS.secondary : COLORS.tertiary }]}>
                {book.status === 'terminé' ? 'Marquer non lu' : 'Marquer terminé'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROGRESS SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Progression de lecture</Text>
          
          <View style={styles.progressRingWrapper}>
            <View style={[styles.progressRing, { borderColor: book.status === 'terminé' ? COLORS.tertiary : COLORS.primary }]}>
              <View style={styles.ringInner}>
                <Text style={styles.progressPercent}>{progressPercentage}%</Text>
              </View>
            </View>
          </View>

          <Text style={styles.progressStats}>{book.currentPage} / {book.pages} pages</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Page actuelle:</Text>
              <TextInput
                style={styles.pageInput}
                value={currentPageInput}
                onChangeText={setCurrentPageInput}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePage}>
              <Text style={styles.updateButtonText}>Mettre à jour</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* READING SESSION CHRONOMETER CARD */}
        <View style={[styles.sectionCard, ZELLIGE_STYLES.borderMotif]}>
          <Text style={styles.sectionTitle}>Session de lecture</Text>
          
          {seconds > 0 || isActive ? (
            <View style={styles.timerDisplayContainer}>
              <Text style={styles.timerDigits}>{formatStopwatch(seconds)}</Text>
              
              <View style={styles.timerControlsRow}>
                {isActive ? (
                  <TouchableOpacity style={[styles.timerControlBtn, styles.timerPauseBtn]} onPress={pauseTimer}>
                    <Text style={styles.timerControlText}>Pause</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.timerControlBtn, styles.timerStartBtn]} onPress={startTimer}>
                    <Text style={styles.timerControlText}>Reprendre</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={[styles.timerControlBtn, styles.timerStopBtn]} onPress={handleEndSession}>
                  <Text style={styles.timerControlText}>Terminer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sessionDesc}>
                Commencez une session de lecture chronométrée pour suivre votre vitesse et votre progression en temps réel.
              </Text>
              <TouchableOpacity style={styles.startSessionBtn} onPress={startTimer}>
                <Text style={styles.startSessionText}>Démarrer la session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* SAVE SESSION MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSessionModalVisible}
        onRequestClose={() => setIsSessionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session terminée ! 🎉</Text>
            <Text style={styles.modalMessage}>
              Vous avez lu pendant <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{Math.ceil(sessionDuration / 60)} min</Text> ({formatStopwatch(sessionDuration)}).
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Combien de pages avez-vous lues ?</Text>
              <TextInput
                style={styles.modalInput}
                value={pagesReadInput}
                onChangeText={setPagesReadInput}
                keyboardType="number-pad"
                placeholder="Ex: 12"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsSessionModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveSession}>
                <Text style={styles.submitBtnText}>Enregistrer la session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.containerMargin,
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerIcon: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.labelSmall,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  coverWrapper: {
    position: 'relative',
    width: 160,
    height: 220,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowHalo: {
    position: 'absolute',
    width: 180,
    height: 240,
    borderRadius: SHAPES.cardRadius,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  coverImage: {
    width: 160,
    height: 220,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  coverImagePlaceholder: {
    width: 160,
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    padding: 12,
    position: 'relative',
  },
  coverArabicTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  coverAuthor: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  editCoverIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCoverText: {
    fontSize: 10,
  },
  bookTitle: {
    ...TYPOGRAPHY.displayMedium,
    marginBottom: 4,
    textAlign: 'center',
  },
  bookAuthor: {
    ...TYPOGRAPHY.bodyMedium,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.sm,
  },
  pillBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SHAPES.pillRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingText: {
    color: '#FFB800',
    fontSize: 12,
  },
  totalPages: {
    ...TYPOGRAPHY.bodyMedium,
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: SPACING.sm,
  },
  outlineButton: {
    borderWidth: 1,
    borderRadius: SHAPES.buttonRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  outlineButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleMedium,
    marginBottom: SPACING.md,
  },
  progressRingWrapper: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    ...TYPOGRAPHY.titleLarge,
    fontWeight: '800',
  },
  progressStats: {
    ...TYPOGRAPHY.bodyLarge,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 40,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 6,
  },
  pageInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 0,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SHAPES.buttonRadius,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionDesc: {
    ...TYPOGRAPHY.bodyMedium,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  startSessionBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SHAPES.buttonRadius,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startSessionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timerDisplayContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  timerDigits: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    fontFamily: 'monospace',
  },
  timerControlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timerControlBtn: {
    height: 40,
    borderRadius: SHAPES.buttonRadius,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerStartBtn: {
    backgroundColor: COLORS.primary,
  },
  timerPauseBtn: {
    backgroundColor: COLORS.borderLight,
  },
  timerStopBtn: {
    backgroundColor: COLORS.secondary,
  },
  timerControlText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: SPACING.containerMargin,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.titleLarge,
    marginBottom: SPACING.md,
  },
  modalMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
    color: COLORS.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: SPACING.lg,
  },
  cancelBtn: {
    height: 44,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SHAPES.buttonRadius,
    height: 44,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
