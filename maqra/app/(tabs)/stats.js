import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { useBookStore } from '../../store/useBookStore';
import { TRANSLATIONS } from '../../lib/localization';
import { COLORS, TYPOGRAPHY, SPACING, SHAPES, ZELLIGE_STYLES } from '../../lib/theme';
import ImagePickerModal from '../../components/ImagePickerModal';

export default function StatsScreen() {
  const { 
    books, 
    annualGoal, 
    streak, 
    totalReadingTime, 
    memberSince, 
    resetToMocks, 
    profilePicture, 
    setProfilePicture,
    language,
    setLanguage
  } = useBookStore();

  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);

  // Localization setup
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const isRtl = language === 'ar';

  // Mount animation for chart
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bezier(0.16, 1, 0.3, 1), // custom clean cubic-bezier easing
      useNativeDriver: false, // animating layout height
    }).start();
  }, [books, language]); // re-animate on data or language change

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

  // Determine top genre dynamically (mostly 'Roman' in Moroccan literature classics, but let's translate)
  const topGenre = language === 'ar' ? 'رواية' : language === 'tz' ? 'ⴰⵔⵓⵎⴰⵏ' : 'Roman';
  const translatedMemberSince = language === 'ar' ? 'مارس 2024' : language === 'tz' ? 'ⵎⴰⵕⵚ 2024' : memberSince;

  // Calculate dynamic completed books per month
  const completedByMonth = { Jan: 0, Fév: 0, Mar: 0, Avr: 0, Mai: 0, Juin: 0 };
  
  completedBooks.forEach(book => {
    if (book.completedAt) {
      const date = new Date(book.completedAt);
      const month = date.getMonth();
      
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
  const handleSelectProfilePicture = () => {
    setIsImagePickerVisible(true);
  };

  // RTL Overrides
  const rowStyle = { flexDirection: isRtl ? 'row-reverse' : 'row' };
  const textAlignStyle = { textAlign: isRtl ? 'right' : 'left' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.zelligeAvatar}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPattern}>💠💠{"\n"}💠💠</Text>
            )}
          </View>
          <TouchableOpacity style={styles.cameraOverlay} onPress={handleSelectProfilePicture}>
            <Text style={styles.cameraText}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>Ahmed Berrada</Text>
        <Text style={styles.profileLocation}>{t.location}</Text>

        <TouchableOpacity style={styles.editButton} onPress={resetToMocks}>
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* LANGUAGE SELECTOR PANEL */}
      <View style={styles.langSelectorCard}>
        <Text style={[styles.langSelectorTitle, textAlignStyle]}>{t.changeLanguageTitle}</Text>
        <View style={[styles.langSelectorRow, rowStyle]}>
          <TouchableOpacity 
            style={[styles.langBtn, language === 'fr' && styles.langBtnActive]} 
            onPress={() => setLanguage('fr')}
          >
            <Text style={[styles.langText, language === 'fr' && styles.langTextActive]}>FR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langBtn, language === 'ar' && styles.langBtnActive]} 
            onPress={() => setLanguage('ar')}
          >
            <Text style={[styles.langText, language === 'ar' && styles.langTextActive]}>العربية</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langBtn, language === 'tz' && styles.langBtnActive]} 
            onPress={() => setLanguage('tz')}
          >
            <Text style={[styles.langText, language === 'tz' && styles.langTextActive]}>ⵜⴰⵎⴰⵣⵉⵖⵜ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* STREAK & HIGHLIGHT ROW */}
      <View style={[styles.highlightRow, rowStyle]}>
        <View style={[styles.highlightCard, { borderColor: COLORS.secondary }]}>
          <Text style={styles.highlightEmoji}>🔥</Text>
          <Text style={[styles.highlightText, { color: COLORS.secondary }]}>
            {t.streakActiveDays.replace('{days}', streak)}
          </Text>
          <Text style={styles.highlightLabel}>{t.streakActive}</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.tertiary }]}>
          <Text style={styles.highlightEmoji}>⭐</Text>
          <Text style={[styles.highlightText, { color: COLORS.tertiary }]}>{topGenre}</Text>
          <Text style={styles.highlightLabel}>{t.topGenre}</Text>
        </View>
        <View style={[styles.highlightCard, { borderColor: COLORS.border }]}>
          <Text style={styles.highlightEmoji}>📅</Text>
          <Text style={[styles.highlightText, { color: COLORS.textSecondary }]}>
            {translatedMemberSince}
          </Text>
          <Text style={styles.highlightLabel}>{t.memberSince}</Text>
        </View>
      </View>

      {/* CUMULATIVE STATS GRID (2x2) */}
      <Text style={[styles.sectionTitle, textAlignStyle]}>{t.globalStats}</Text>
      <View style={styles.gridContainer}>
        <View style={[styles.gridRow, rowStyle]}>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={[styles.gridCardHeader, rowStyle]}>
              <Text style={styles.gridCardEmoji}>📚</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.primary }]}>{totalBooks}</Text>
            </View>
            <Text style={[styles.gridCardLabel, textAlignStyle]}>{t.booksTotal}</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.primary }]} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={[styles.gridCardHeader, rowStyle]}>
              <Text style={styles.gridCardEmoji}>📄</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.tertiary }]}>{totalPagesRead.toLocaleString()}</Text>
            </View>
            <Text style={[styles.gridCardLabel, textAlignStyle]}>{t.pagesLues}</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.tertiary }]} />
          </View>
        </View>
        <View style={[styles.gridRow, rowStyle]}>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={[styles.gridCardHeader, rowStyle]}>
              <Text style={styles.gridCardEmoji}>⏱️</Text>
              <Text style={[styles.gridCardValue, { color: '#E4A81B' }]}>{formatTime(totalReadingTime)}</Text>
            </View>
            <Text style={[styles.gridCardLabel, textAlignStyle]}>{t.totalTime}</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: '#E4A81B' }]} />
          </View>
          <View style={[styles.gridCard, ZELLIGE_STYLES.borderMotif]}>
            <View style={[styles.gridCardHeader, rowStyle]}>
              <Text style={styles.gridCardEmoji}>🔥</Text>
              <Text style={[styles.gridCardValue, { color: COLORS.secondary }]}>{streak} j</Text>
            </View>
            <Text style={[styles.gridCardLabel, textAlignStyle]}>{t.streakActive}</Text>
            <View style={[styles.miniZelligeSeparator, { backgroundColor: COLORS.secondary }]} />
          </View>
        </View>
      </View>

      {/* BAR CHART SECTION */}
      <View style={styles.chartCard}>
        <Text style={[styles.chartTitle, textAlignStyle]}>{t.chartTitle}</Text>
        
        {/* Dynamic animated bar chart */}
        <View style={[styles.chartContainer, rowStyle]}>
          {Object.keys(completedByMonth).map((month) => {
            const count = completedByMonth[month];
            const targetHeight = getBarHeight(count);
            
            // Interpolate animation scale to animate heights smoothly
            const animatedHeight = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, targetHeight]
            });
            
            let barColor = COLORS.borderLight;
            if (count > 0) {
              barColor = month === 'Mar' ? COLORS.primary : count > 1 ? COLORS.secondary : COLORS.primary;
            }

            return (
              <View key={month} style={styles.chartBarWrapper}>
                <Animated.View style={[styles.chartBar, { height: animatedHeight, backgroundColor: barColor }]} />
                <Text style={styles.chartBarLabel}>{month}</Text>
                {count > 0 && <Text style={styles.chartBarCount}>{count}</Text>}
              </View>
            );
          })}
        </View>
      </View>
      <ImagePickerModal
        isVisible={isImagePickerVisible}
        onClose={() => setIsImagePickerVisible(false)}
        onSelectImage={(uri) => setProfilePicture(uri)}
        aspect={[1, 1]}
        language={language}
      />
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
  langSelectorCard: {
    backgroundColor: COLORS.card,
    borderRadius: SHAPES.cardRadius,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  langSelectorTitle: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  langSelectorRow: {
    gap: 8,
  },
  langBtn: {
    flex: 1,
    height: 36,
    borderRadius: SHAPES.buttonRadius,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  langText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  langTextActive: {
    color: COLORS.primary,
  },
  highlightRow: {
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
    textAlign: 'center',
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
