import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {colors} from '../const/Colors';
import Precription from '../common/Precription';
import PrecriptionText from '../common/AddPrescription';
import LabTest from '../common/LabTest';
import LabTestPatient from '../common/LabTestPatient';
import Report from '../common/LabTestPatient';
import AddPrescription from '../common/AddPrescription';

export default function UploadPrecription({navigation, route}) {
  const { patientId, doctorId, appointmentId } = route.params || {};
  console.log('UploadPrecription received:', { patientId, doctorId, appointmentId });
  const [activeTab, setActiveTab] = useState('Precription');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Precription' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Precription')}>
          <Text style={styles.tabLabel(activeTab === 'Precription')}>
            Upload Precription
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'AddPrescription' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('AddPrescription')}>
          <Text style={styles.tabLabel(activeTab === 'AddPrescription')}>
            Add Precription
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'LabTest' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('LabTest')}>
          <Text style={styles.tabLabel(activeTab === 'LabTest')}>LabTest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Report' && styles.activeTab]}
          onPress={() => setActiveTab('Report')}>
          <Text style={styles.tabLabel(activeTab === 'Report')}>
            Old Report
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Precription' && <Precription appointmentId={appointmentId} patientId={patientId} />}
      {activeTab === 'AddPrescription' && <AddPrescription navigation={navigation} patientId={patientId} doctorId={doctorId} appointmentId={appointmentId} />}
      {activeTab === 'Report' && <Report />}
      {activeTab === 'LabTest' && <LabTest />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.transparent,
    marginHorizontal: 3,
  },
  activeTab: {
    backgroundColor: colors.greenCustom,
  },
  tabLabel: isActive => ({
    color: isActive ? 'white' : colors.black,
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: 16,
    textAlign: 'center',
  }),
});
