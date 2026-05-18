import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Precription from '../common/Precription';
import AddPrescription from '../common/AddPrescription';
import LabTest from '../common/LabTest';
import Report from '../common/LabTestPatient';

const COLORS = {
  background: '#0F172A',
  card: '#111827',
  card2: '#1E293B',
  white: '#FFFFFF',
  text: '#F8FAFC',
  subText: '#94A3B8',
  primary: '#7C3AED',
  secondary: '#A855F7',
  border: 'rgba(255,255,255,0.08)',
};

export default function UploadPrecription({navigation, route}) {
  const { patientId, doctorId, appointmentId } = route.params || {};
  const [activeTab, setActiveTab] = useState('Precription');

  const tabs = [
    { id: 'Precription', label: 'Upload Prescription' },
    { id: 'AddPrescription', label: 'Add Prescription' },
    { id: 'LabTest', label: 'Lab Test' },
    { id: 'Report', label: 'Old Report' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={styles.tabLabel(activeTab === tab.id)}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'Precription' && <Precription appointmentId={appointmentId} patientId={patientId} />}
        {activeTab === 'AddPrescription' && <AddPrescription navigation={navigation} patientId={patientId} doctorId={doctorId} appointmentId={appointmentId} />}
        {activeTab === 'Report' && <Report />}
        {activeTab === 'LabTest' && <LabTest />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    minWidth: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: isActive => ({
    color: isActive ? COLORS.white : COLORS.subText,
    fontWeight: isActive ? '700' : '500',
    fontSize: 11,
    textAlign: 'center',
  }),
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
