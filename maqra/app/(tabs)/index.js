import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function BibliothequeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
            <Text style={styles.avatarText}>AB</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.subtitle}>Bonjour, Ahmed 👋</Text>

      {/* ANNUAL GOAL RING (hero card) */}
      <View style={[styles.heroCard, ZELLIGE_STYLES.borderMotif]}>
        <Text style={styles.goalLabel}>Objectif annuel 2024</Text>
        <View style={styles.ringContainer}>
          {/* Simulated progress ring */}
          <View style={styles.progressRing}>
            <View style={styles.ringInner}>
              <Text style={styles.ringValue}>7 / 24</Text>
              <Text style={styles.ringSubvalue}>livres lus</Text>
            </View>
          </View>
        </View>
      </View>

      {/* QUICK STATS ROW */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, ZELLIGE_STYLES.leftAccent]}>
          <Text style={styles.statEmoji}>📚</Text>
          <Text style={styles.statVal}>42</Text>
          <Text style={styles.statLbl}>Livres</Text>
        </View>
        <View style={[styles.statCard, ZELLIGE_STYLES.leftAccentMint]}>
          <Text style={styles.statEmoji}>📖</Text>
          <Text style={styles.statVal}>8 420</Text>
          <Text style={styles.statLbl}>Pages lues</Text>
        </View>
        <View style={[styles.statCard, ZELLIGE_STYLES.leftAccentTerracotta]}>
          <Text style={styles.statEmoji}>📅</Text>
          <Text style={styles.statVal}>3</Text>
          <Text style={styles.statLbl}>Ce mois</Text>
        </View>
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un livre..."
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
      
      {/* SCREEN FOOTER OR PLACEHOLDER COMMENT */}
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>Bibliothèque Dashboard</Text>
        <Text style={styles.placeholderDesc}>
          Ceci est le tableau de bord principal de votre bibliothèque. Vous y trouverez vos objectifs de lecture, vos statistiques rapides et vos livres en cours.
        </Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.xl,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  placeholderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholderTitle: {
    ...TYPOGRAPHY.titleMedium,
    marginBottom: SPACING.sm,
  },
  placeholderDesc: {
    ...TYPOGRAPHY.bodyMedium,
    lineHeight: 20,
  },
});
