import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {/* Avatar with zellige geometric motif pattern placeholder */}
          <View style={styles.zelligeAvatar}>
            <Text style={styles.avatarPattern}>💠💠{"\n"}💠💠</Text>
          </View>
          {/* Camera icon overlay in terracotta circle */}
          <TouchableOpacity style={styles.cameraOverlay}>
            <Text style={styles.cameraText}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>Ahmed Berrada</Text>
        <Text style={styles.profileLocation}>Lecteur depuis Casablanca 📍</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* STREAK & HIGHLIGHT ROW */}
      <View style={styles.highlightRow}>
        <View style={[styles.highlightCard, { borderColor: COLORS.secondary }]}>
          <Text style={styles.highlightEmoji}>🔥</Text>
          <Text style={[styles.highlightText, { color: COLORS.secondary }]}>12 jours</Text>
          <Text style={styles.highlightLabel}>Série active</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.tertiary }]}>
          <Text style={styles.highlightEmoji}>⭐</Text>
          <Text style={[styles.highlightText, { color: COLORS.tertiary }]}>Roman</Text>
          <Text style={styles.highlightLabel}>Top genre</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.border }]}>
          <Text style={styles.highlightEmoji}>📅</Text>
          <Text style={[styles.highlightText, { color: COLORS.textSecondary }]}>Mars 2024</Text>
          <Text style={styles.highlightLabel}>Membre depuis</Text>
        </View>
      </View>

      {/* CUMULATIVE STATS GRID (2x2) */}
      <Text style={styles.sectionTitle}>Statistiques globales</Text>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>📚</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.primary }]}>42</Text>
            </View>
            <Text style={styles.gridCardLabel}>Livres total</Text>
            <View style={styles.miniZelligeSeparator} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>📄</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.tertiary }]}>8 420</Text>
            </View>
            <Text style={styles.gridCardLabel}>Pages lues</Text>
            <View style={styles.miniZelligeSeparator} />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>⏱️</Text>
              <Text style={[styles.gridCardValue, { color: '#E4A81B' }]}>47h 30m</Text>
            </View>
            <Text style={styles.gridCardLabel}>Temps total</Text>
            <View style={styles.miniZelligeSeparator} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>🔥</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.secondary }]}>12 j</Text>
            </View>
            <Text style={styles.gridCardLabel}>Série actuelle</Text>
            <View style={styles.miniZelligeSeparator} />
          </View>
        </View>
      </View>

      {/* BAR CHART SECTION */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Livres terminés par mois</Text>
        
        {/* Simulated elegant bar chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 40 }]} />
            <Text style={styles.chartBarLabel}>Jan</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 70, backgroundColor: COLORS.primary }]} />
            <Text style={styles.chartBarLabel}>Fév</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 95, backgroundColor: COLORS.primary }]} />
            <Text style={styles.chartBarLabel}>Mar</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 60 }]} />
            <Text style={styles.chartBarLabel}>Avr</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 80 }]} />
            <Text style={styles.chartBarLabel}>Mai</Text>
          </View>
          <View style={styles.chartBarWrapper}>
            <View style={[styles.chartBar, { height: 110, backgroundColor: COLORS.secondary }]} />
            <Text style={styles.chartBarLabel}>Juin</Text>
          </View>
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SHAPES.cardRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  zelligeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPattern: {
    color: COLORS.textSecondary,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.7,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  cameraText: {
    fontSize: 12,
  },
  profileName: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: 'bold',
  },
  profileLocation: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 12,
    marginTop: 4,
  },
  editButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 18,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  highlightEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  highlightLabel: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 9,
    marginTop: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleMedium,
    marginBottom: SPACING.md,
  },
  gridContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  gridCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridCardEmoji: {
    fontSize: 20,
  },
  gridCardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  gridCardLabel: {
    ...TYPOGRAPHY.labelSmall,
  },
  miniZelligeSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.lg,
  },
  chartTitle: {
    ...TYPOGRAPHY.titleMedium,
    marginBottom: SPACING.xl,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  chartBarWrapper: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  chartBar: {
    width: 20,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
  },
  chartBarLabel: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 10,
  },
});
