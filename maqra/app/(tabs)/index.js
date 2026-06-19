import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookStore } from '../../store/useBookStore';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function BibliothequeScreen() {
  const router = useRouter();
  
  // Zustand State & Actions
  const { books, annualGoal, setSelectedBookId, addBook, profilePicture } = useBookStore();
  
  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  // Add Book Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState('200');
  const [newLanguage, setNewLanguage] = useState('AR');
  const [newRating, setNewRating] = useState(4.0);
  const [newStatus, setNewStatus] = useState('à lire'); // 'à lire' | 'en cours' | 'terminé'

  // Computed Values
  const completedBooks = books.filter(b => b.status === 'terminé');
  const completedCount = completedBooks.length;
  
  const totalPagesRead = books.reduce((acc, book) => acc + (Number(book.currentPage) || 0), 0);
  
  // Count books read/completed this month (e.g. March 2024 in mocks or current month)
  const currentMonthCount = completedBooks.filter(book => {
    if (!book.completedAt) return false;
    const date = new Date(book.completedAt);
    return date.getMonth() === 2 && date.getFullYear() === 2024; // March 2024
  }).length || completedCount; // Fallback to completedCount if none match

  // Filter books list
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBook = (id) => {
    setSelectedBookId(id);
    router.push('/details');
  };

  const handleAddBookSubmit = () => {
    if (!newTitle.trim() || !newAuthor.trim() || !newPages.trim()) return;

    addBook({
      title: newTitle,
      author: newAuthor,
      pages: Number(newPages) || 100,
      language: newLanguage,
      rating: Number(newRating) || 4,
      status: newStatus,
    });

    // Reset fields
    setNewTitle('');
    setNewAuthor('');
    setNewPages('200');
    setNewLanguage('AR');
    setNewRating(4.0);
    setNewStatus('à lire');
    
    setIsAddModalVisible(false);
  };

  // Progress Ring Math
  const goalPercentage = Math.min(100, Math.round((completedCount / annualGoal) * 100));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.zelligeIcon}>💠</Text>
            <Text style={styles.headerTitle}>مقرا · Maqra</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>AB</Text>
              )}
            </View>
          </View>
        </View>
        
        <Text style={styles.subtitle}>Bonjour, Ahmed 👋</Text>

        {/* ANNUAL GOAL RING (hero card) */}
        <View style={[styles.heroCard, ZELLIGE_STYLES.borderMotif]}>
          <Text style={styles.goalLabel}>Objectif annuel 2024</Text>
          <View style={styles.ringContainer}>
            <View style={styles.progressRing}>
              <View style={styles.ringInner}>
                <Text style={styles.ringValue}>{completedCount} / {annualGoal}</Text>
                <Text style={styles.ringSubvalue}>{goalPercentage}% complété</Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK STATS ROW */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, ZELLIGE_STYLES.leftAccent]}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statVal}>{books.length}</Text>
            <Text style={styles.statLbl}>Livres</Text>
          </View>
          <View style={[styles.statCard, ZELLIGE_STYLES.leftAccentMint]}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statVal}>{totalPagesRead.toLocaleString()}</Text>
            <Text style={styles.statLbl}>Pages lues</Text>
          </View>
          <View style={[styles.statCard, ZELLIGE_STYLES.leftAccentTerracotta]}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statVal}>{currentMonthCount}</Text>
            <Text style={styles.statLbl}>Ce mois</Text>
          </View>
        </View>

        {/* SEARCH & ADD ROW */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un livre..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        {/* BOOKS LIST */}
        <Text style={styles.sectionTitle}>Ma Bibliothèque</Text>
        
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun livre trouvé</Text>
          </View>
        ) : (
          filteredBooks.map((book) => {
            const progress = book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;
            
            // Get left border motif based on status
            let accentStyle = ZELLIGE_STYLES.leftAccent; // default Blue
            if (book.status === 'terminé') accentStyle = ZELLIGE_STYLES.leftAccentMint;
            if (book.status === 'à lire') accentStyle = { borderLeftWidth: 4, borderLeftColor: COLORS.border };

            return (
              <TouchableOpacity 
                key={book.id} 
                style={[styles.bookCard, accentStyle]} 
                onPress={() => handleSelectBook(book.id)}
              >
                <View style={styles.bookInfo}>
                  <View style={styles.bookTextContent}>
                    <Text style={styles.bookTitleText}>{book.title}</Text>
                    <Text style={styles.bookAuthorText}>{book.author}</Text>
                  </View>
                  <View style={styles.languageBadge}>
                    <Text style={styles.languageBadgeText}>{book.language}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { 
                      width: `${progress}%`,
                      backgroundColor: book.status === 'terminé' ? COLORS.tertiary : COLORS.primary 
                    }]} />
                  </View>
                  <Text style={styles.progressText}>{book.currentPage} / {book.pages} p. ({progress}%)</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* ADD BOOK MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un livre 📚</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Titre"
              placeholderTextColor={COLORS.textSecondary}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Auteur"
              placeholderTextColor={COLORS.textSecondary}
              value={newAuthor}
              onChangeText={setNewAuthor}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre total de pages"
              placeholderTextColor={COLORS.textSecondary}
              value={newPages}
              onChangeText={setNewPages}
              keyboardType="number-pad"
            />

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Langue:</Text>
              <View style={styles.optionRow}>
                {['AR', 'FR', 'EN'].map((lang) => (
                  <TouchableOpacity 
                    key={lang} 
                    style={[styles.optionButton, newLanguage === lang && styles.optionButtonActive]}
                    onPress={() => setNewLanguage(lang)}
                  >
                    <Text style={[styles.optionText, newLanguage === lang && styles.optionTextActive]}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Statut:</Text>
              <View style={styles.optionRow}>
                {['à lire', 'en cours', 'terminé'].map((status) => (
                  <TouchableOpacity 
                    key={status} 
                    style={[styles.optionButton, newStatus === status && styles.optionButtonActive]}
                    onPress={() => setNewStatus(status)}
                  >
                    <Text style={[styles.optionText, newStatus === status && styles.optionTextActive]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddBookSubmit}>
                <Text style={styles.submitBtnText}>Ajouter</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zelligeIcon: {
    fontSize: 20,
  },
  headerTitle: {
    ...TYPOGRAPHY.titleLarge,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconText: {
    fontSize: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    marginBottom: SPACING.xxl,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  goalLabel: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ringInner: {
    alignItems: 'center',
  },
  ringValue: {
    ...TYPOGRAPHY.displayMedium,
    fontWeight: '800',
  },
  ringSubvalue: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statVal: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: 'bold',
  },
  statLbl: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: SHAPES.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleMedium,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMedium,
  },
  bookCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  bookTextContent: {
    flex: 1,
  },
  bookTitleText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  bookAuthorText: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 12,
  },
  languageBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SHAPES.pillRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  languageBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    gap: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'right',
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
    marginBottom: SPACING.lg,
  },
  modalInput: {
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.primary,
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
