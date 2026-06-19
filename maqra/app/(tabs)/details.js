import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function DetailsScreen() {
  const [currentPage, setCurrentPage] = useState('476');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>البؤساء</Text>
          <Text style={styles.headerSubtitle}>Victor Hugo</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.headerIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* BOOK HERO CARD */}
      <View style={styles.heroCard}>
        {/* Glow halo & cover placeholder */}
        <View style={styles.coverWrapper}>
          <View style={styles.glowHalo} />
          <View style={styles.coverImagePlaceholder}>
            <Text style={styles.coverArabicTitle}>البؤساء</Text>
            <Text style={styles.coverAuthor}>Hugo</Text>
          </View>
        </View>

        <Text style={styles.bookTitle}>البؤساء</Text>
        <Text style={styles.bookAuthor}>Victor Hugo</Text>

        <View style={styles.badgeRow}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>AR</Text>
          </View>
          <Text style={styles.ratingText}>⭐ ⭐ ⭐ ⭐ ⯪ (4.5)</Text>
        </View>

        <Text style={styles.totalPages}>712 pages</Text>

        <View style={styles.statusRow}>
          <View style={[styles.pillBadge, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.pillBadgeText, { color: COLORS.primary }]}>En cours</Text>
          </View>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Marquer terminé</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PROGRESS SECTION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Progression de lecture</Text>
        
        <View style={styles.progressRingWrapper}>
          <View style={styles.progressRing}>
            <View style={styles.ringInner}>
              <Text style={styles.progressPercent}>67%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.progressStats}>476 / 712 pages</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Page actuelle:</Text>
            <TextInput
              style={styles.pageInput}
              value={currentPage}
              onChangeText={setCurrentPage}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Mettre à jour</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* READING SESSION CARD */}
      <View style={[styles.sectionCard, ZELLIGE_STYLES.borderMotif]}>
        <Text style={styles.sectionTitle}>Session de lecture</Text>
        <Text style={styles.sessionDesc}>
          Commencez une session de lecture chronométrée pour suivre votre vitesse et votre progression en temps réel.
        </Text>
        <TouchableOpacity style={styles.startSessionBtn}>
          <Text style={styles.startSessionText}>Démarrer la session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.labelSmall,
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
  coverImagePlaceholder: {
    width: 160,
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  coverArabicTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  coverAuthor: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  bookTitle: {
    ...TYPOGRAPHY.displayMedium,
    marginBottom: 4,
  },
  bookAuthor: {
    ...TYPOGRAPHY.bodyMedium,
    marginBottom: SPACING.md,
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
    borderColor: COLORS.tertiary,
    borderRadius: SHAPES.buttonRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  outlineButtonText: {
    color: COLORS.tertiary,
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
    borderColor: COLORS.primary,
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
});
