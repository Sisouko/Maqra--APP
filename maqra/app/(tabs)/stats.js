import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useBookStore } from '../../store/useBookStore';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';

export default function StatsScreen() {
  const { books, annualGoal, streak, totalReadingTime, memberSince, resetToMocks, profilePicture, setProfilePicture } = useBookStore();

  // Computed Values
  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'terminé');
  const completedCount = completedBooks.length;
  
  const totalPagesRead = books.reduce((acc, book) => acc + (Number(book.currentPage) || 0), 0);

  // Helper to format minutes to hours and minutes
  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Determine top genre dynamically
  const topGenre = 'Roman';

  // Calculate dynamic bar chart heights (books completed per month)
  const completedByMonth = { Jan: 0, Fév: 0, Mar: 0, Avr: 0, Mai: 0, Juin: 0 };
  
  completedBooks.forEach(book => {
    if (book.completedAt) {
      const date = new Date(book.completedAt);
      const month = date.getMonth(); // 0 = Jan, 1 = Feb, 2 = Mar...
      
      // Map to Jan-June labels
      if (month === 0) completedByMonth.Jan++;
      if (month === 1) completedByMonth.Fév++;
      if (month === 2) completedByMonth.Mar++;
      if (month === 3) completedByMonth.Avr++;
      if (month === 4) completedByMonth.Mai++;
      if (month === 5) completedByMonth.Juin++;
    }
  });

  const getBarHeight = (count) => {
    if (count === 0) return 10;
    return Math.min(120, count * 35);
  };

  // Profile Picture Selector
  const handleSelectProfilePicture = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' && libraryPermission.status !== 'granted') {
      alert("Nous avons besoin des permissions d'accès aux photos et à la caméra pour changer votre photo de profil !");
      return;
    }

    try {
      // Try camera first
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      // Fallback to library (e.g. simulator without camera)
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setProfilePicture(result.assets[0].uri);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {/* Avatar with image or zellige geometric motif pattern placeholder */}
          <View style={styles.zelligeAvatar}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPattern}>💠💠{"\n"}💠💠</Text>
            )}
          </View>
          {/* Camera icon overlay in terracotta circle */}
          <TouchableOpacity style={styles.cameraOverlay} onPress={handleSelectProfilePicture}>
            <Text style={styles.cameraText}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>Ahmed Berrada</Text>
        <Text style={styles.profileLocation}>Lecteur depuis Casablanca 📍</Text>

        <TouchableOpacity style={styles.editButton} onPress={resetToMocks}>
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* STREAK & HIGHLIGHT ROW */}
      <View style={styles.highlightRow}>
        <View style={[styles.highlightCard, { borderColor: COLORS.secondary }]}>
          <Text style={styles.highlightEmoji}>🔥</Text>
          <Text style={[styles.highlightText, { color: COLORS.secondary }]}>{streak} jours</Text>
          <Text style={styles.highlightLabel}>Série active</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.tertiary }]}>
          <Text style={styles.highlightEmoji}>⭐</Text>
          <Text style={[styles.highlightText, { color: COLORS.tertiary }]}>{topGenre}</Text>
          <Text style={styles.highlightLabel}>Top genre</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.border }]}>
          <Text style={styles.highlightEmoji}>📅</Text>
          <Text style={[styles.highlightText, { color: COLORS.textSecondary }]}>{memberSince}</Text>
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
              <Text style={[styles.gridCardValue, { color: COLORS.primary }]}>{totalBooks}</Text>
            </View>
            <Text style={styles.gridCardLabel}>Livres total</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.primary }]} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>📄</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.tertiary }]}>{totalPagesRead.toLocaleString()}</Text>
            </View>
            <Text style={styles.gridCardLabel}>Pages lues</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.tertiary }]} />
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>⏱️</Text>
              <Text style={[styles.gridCardValue, { color: '#E4A81B' }]}>{formatTime(totalReadingTime)}</Text>
            </View>
            <Text style={styles.gridCardLabel}>Temps total</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: '#E4A81B' }]} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={styles.gridCardHeader}>
              <Text style={styles.gridCardEmoji}>🔥</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.secondary }]}>{streak} j</Text>
            </View>
            <Text style={styles.gridCardLabel}>Série actuelle</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.secondary }]} />
          </View>
        </View>
      </View>

      {/* BAR CHART SECTION */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Livres terminés par mois</Text>
        
        {/* Dynamic elegant bar chart */}
        <View style={styles.chartContainer}>
          {Object.keys(completedByMonth).map((month) => {
            const count = completedByMonth[month];
            const height = getBarHeight(count);
            
            let barColor = COLORS.borderLight;
            if (count > 0) {
              barColor = month === 'Mar' ? COLORS.primary : count > 1 ? COLORS.secondary : COLORS.primary;
            }

            return (
              <View key={month} style={styles.chartBarWrapper}>
                <View style={[styles.chartBar, { height: height, backgroundColor: barColor }]} />
                <Text style={styles.chartBarLabel}>{month}</Text>
                {count > 0 && <Text style={styles.chartBarCount}>{count}</Text>}
              </View>
            );
          })}
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
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
  resetButtonText: {
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
    gap: 4,
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
  },
  chartBarLabel: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 10,
  },
  chartBarCount: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
});
