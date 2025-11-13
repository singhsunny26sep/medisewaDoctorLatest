import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DropDown from '../components/DropDown';
import ImagePicker from 'react-native-image-crop-picker';
import {colors} from '../const/Colors';
import {MultiSelect} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {apiCall} from '../const/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const frequencyData = [
  {label: 'Once a day (OD)', value: 'Once a day (OD)'},
  {label: 'Twice a day (BD)', value: 'Twice a day (BD)'},
  {label: 'Three times a day (TDS)', value: 'Three times a day (TDS)'},
  {label: 'Four times a day (QID)', value: 'Four times a day (QID)'},
  {label: 'Every hour (qH)', value: 'Every hour (qH)'},
  {label: 'Every night at bedtime (HS)', value: 'Every night at bedtime (HS)'},
  {label: 'Before meal (AC)', value: 'Before meal (AC)'},
  {label: 'After meal (PC)', value: 'After meal (PC)'},
  {label: 'As needed (SOS)', value: 'As needed (SOS)'},
];

const durationData = [
  {label: '1 day', value: '1 day'},
  {label: '3 days', value: '3 days'},
  {label: '5 days', value: '5 days'},
  {label: '7 days', value: '7 days'},
  {label: '10 days', value: '10 days'},
  {label: '15 days', value: '15 days'},
  {label: '1 month', value: '1 month'},
  {label: 'Continue', value: 'Continue'},
];

const diagnosticsData = [
  {label: 'Blood Test', value: 'blood_test'},
  {label: 'X-Ray', value: 'xray'},
  {label: 'MRI', value: 'mri'},
  {label: 'CT Scan', value: 'ct_scan'},
  {label: 'Ultrasound', value: 'ultrasound'},
];

export default function AddPrescription({navigation, patientId, doctorId, appointmentId}) {
  // console.log('AddPrescription received:', { patientId, doctorId, appointmentId });
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [signatureImage, setSignatureImage] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [pastInvestigations, setPastInvestigations] = useState([]);
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [clinicIssues, setClinicIssues] = useState('');
  const [allergy, setAllergy] = useState('');
  const [pr, setPr] = useState('');
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [rr, setRr] = useState('');
  const [rbs, setRbs] = useState('');
  const [referDoctor, setReferDoctor] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [selectedPastInvestigations, setSelectedPastInvestigations] = useState([]);
  const [pdfPath, setPdfPath] = useState('');
  const [medicineSelectorVisible, setMedicineSelectorVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const medicineMultiSelectRef = useRef(null);
  
  const [manualMedicineName, setManualMedicineName] = useState('');
  const [manualDosage, setManualDosage] = useState('');
  const [manualFrequency, setManualFrequency] = useState('');
  const [manualDuration, setManualDuration] = useState('');
  const [manualMedicines, setManualMedicines] = useState([]);
  
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisPagination, setDiagnosisPagination] = useState({
    totalDocuments: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

  const fetchDiagnosisData = async (page = 1, limit = 10) => {
    try {
      setDiagnosisLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${apiCall.mainUrl}/diagnancy/pagination?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const formattedDiagnosis = response.data.result.map(item => ({
          label: item.name,
          value: item._id
        }));
        
        if (page === 1) {
          setDiagnosisData(formattedDiagnosis);
        } else {
          setDiagnosisData(prev => [...prev, ...formattedDiagnosis]);
        }
        
        setDiagnosisPagination(response.data.pagination);
      } else {
        Alert.alert('Error', 'Failed to fetch diagnosis data');
      }
    } catch (error) {
      console.error('Error fetching diagnosis data:', error);
      Alert.alert('Error', 'Failed to fetch diagnosis data');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const loadMoreDiagnosis = () => {
    if (diagnosisPagination.currentPage < diagnosisPagination.totalPages && !diagnosisLoading) {
      fetchDiagnosisData(diagnosisPagination.currentPage + 1, diagnosisPagination.limit);
    }
  };

  useEffect(() => {
    fetchDiagnosisData();
    
    const fetchMedicines = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `${apiCall.mainUrl}/bookings/getPrescriptions/${patientId}`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        if (response.data.success && response.data.result.medicines) {
          const formatted = response.data.result.medicines.map(med => ({
            label: `${med.medicineName} (${med.dosage}, ${med.frequency}, ${med.duration})`,
            value: med._id,
          }));
          setMedicineData(formatted);
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Function to handle image selection option
  const handleSelectImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage(setPrescriptionImages, false, false, true); // Camera
          } else if (buttonIndex === 2) {
            pickImage(setPrescriptionImages, false, true); // Gallery
          }
        }
      );
    } else {
      setImagePickerModalVisible(true);
    }
  };

  // Update pickImage to support camera
  const pickImage = async (setter, crop = false, multiple = false, useCamera = false) => {
    try {
      let images;
      if (useCamera) {
        images = await ImagePicker.openCamera({
          width: crop ? 300 : 400,
          height: crop ? 100 : 400,
          cropping: crop,
          compressImageQuality: 0.8,
          mediaType: 'photo',
        });
        setPrescriptionImages(prev => [...prev, images]);
      } else {
        images = await ImagePicker.openPicker({
          width: crop ? 300 : 400,
          height: crop ? 100 : 400,
          cropping: crop,
          compressImageQuality: 0.8,
          mediaType: 'photo',
          multiple: multiple,
        });
        if (multiple) {
          setPrescriptionImages(prev => [...prev, ...images]);
        } else {
          setter(images);
        }
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', error.message || 'Image pick error');
      }
    }
  };

  const removePrescriptionImage = index => {
    setPrescriptionImages(prev => prev.filter((_, i) => i !== index));
  };

 
  const removeManualMedicine = id => {
    setManualMedicines(prev => prev.filter(med => med.id !== id));
  };

  const handleSubmit = async () => {
    const selectedDiagnosisItem = diagnosisData.find(item => item.value === selectedDiagnostic);
    const diagnosisName = selectedDiagnosisItem ? selectedDiagnosisItem.label : selectedDiagnostic;

    const data = {
      patientId: patientId, 
      appointmentId: appointmentId, 
      clinicSummary: clinicalSummary || "any string",
      allergy: allergy ? allergy.split(',').map(a => a.trim()) : ["any string"],
      details: prescriptionDetails || "any string",
      invastigationAdvice: diagnosisName || "any string",
      bp: bp || "any string",
      pr: pr || "any string",
      temp: temp || "any string",
      spo: spo2 || "any string",
      rr: rr || "any string",
      rbs: rbs || "any string",
      clinicIssues: clinicIssues || "any string",
      pastInvestigations: selectedPastInvestigations.length > 0 ? selectedPastInvestigations : ["any string"],
      medicines: [
        ...selectedMedicines.map(medId => {
          const selectedMed = medicineData.find(med => med.value === medId);
          if (selectedMed) {
            const matches = selectedMed.label.match(/^(.*?)\s*\((.*?),\s*(.*?),\s*(.*?)\)$/);
            return {
              medicineName: matches ? matches[1] : selectedMed.label.split('(')[0],
              dosage: matches ? matches[2] : '',
              frequency: matches ? matches[3] : '',
              duration: matches ? matches[4] : '',
              description: '',
            };
          }
          return null;
        }).filter(Boolean),
        ...manualMedicines.map(med => ({
          medicineName: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          description: '',
        })),
      ]
    };

    console.log('Submitting prescription data:', data);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await axios.post(
        `${apiCall.mainUrl}/doctors/addReceipt`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API response:', response.data);

      if (response.data.success) {
        await handleGeneratePDF();
      } else {
        Alert.alert('Error', response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Submission failed');
    }
  };

  const handleGeneratePDF = async () => {
    setPdfLoading(true);
    try {
      const imagesBase64 = await Promise.all(
        prescriptionImages.map(async (img) => {
          try {
            const base64 = await RNFS.readFile(img.path, 'base64');
            return `data:image/jpeg;base64,${base64}`;
          } catch (e) {
            return null;
          }
        })
      );

      const selectedDiagnosisItem = diagnosisData.find(item => item.value === selectedDiagnostic);
      const diagnosisName = selectedDiagnosisItem ? selectedDiagnosisItem.label : selectedDiagnostic;

      let medicineCounter = 0;
      const selectedMedsRows = medicineData
        .filter(med => selectedMedicines.includes(med.value))
        .map(med => {
          medicineCounter++;
          const matches = med.label.match(/^(.*?)\s*\((.*?),\s*(.*?),\s*(.*?)\)$/);
          const medName = matches ? matches[1] : med.label.split('(')[0];
          const dosage = matches ? matches[2] : '-';
          const frequency = matches ? matches[3] : '-';
          const duration = matches ? matches[4] : '-';
          return `
            <tr>
              <td>${medicineCounter}</td>
              <td>${medName}</td>
              <td>${dosage}</td>
              <td>${frequency}</td>
              <td>${duration}</td>
            </tr>
          `;
        }).join('');

      const manualMedsRows = manualMedicines.map(med => {
        medicineCounter++;
        return `
          <tr>
            <td>${medicineCounter}</td>
            <td>${med.name}</td>
            <td>${med.dosage}</td>
            <td>${med.frequency}</td>
            <td>${med.duration}</td>
          </tr>
        `;
      }).join('');

      const noMedsRow = medicineCounter === 0 ? '<tr><td colspan="5" style="text-align: center;">No medicines prescribed.</td></tr>' : '';

      let htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                font-size: 12px;
                color: #333;
                background-color: #f9f9f9;
              }
              .page {
                padding: 25px;
                margin: 20px;
                background-color: white;
                box-shadow: 0 0 15px rgba(0,0,0,0.07);
                border-radius: 8px;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding-bottom: 15px;
                border-bottom: 3px solid #00695C; /* Dark Teal */
              }
              .clinic-info .clinic-name {
                font-size: 26px;
                font-weight: bold;
                color: #004D40; /* Darker Teal */
                margin-bottom: 4px;
              }
              .clinic-info .clinic-address {
                font-size: 11px;
                color: #444;
                max-width: 250px;
              }
              .header .logo {
                width: 75px;
                height: 75px;
              }
              .title {
                text-align: center;
                font-size: 22px;
                font-weight: 600;
                color: #00695C;
                margin: 20px 0;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                background-color: #E0F2F1;
                padding: 8px;
                border-radius: 4px;
              }
              .section {
                margin-bottom: 18px;
              }
              .section-title {
                font-size: 15px;
                font-weight: bold;
                color: #004D40;
                border-bottom: 1px solid #B2DFDB; /* Light teal */
                padding-bottom: 6px;
                margin-bottom: 10px;
              }
              .two-columns {
                display: flex;
                justify-content: space-between;
                gap: 20px;
                align-items: flex-start;
              }
              .column {
                flex: 1;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 90px 1fr;
                gap: 7px;
              }
              .info-grid .label {
                font-weight: bold;
                color: #333;
              }
              .vitals-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                background-color: #F7FDFD;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #E0F2F1;
              }
              .vitals-grid .vital-item {
                text-align: center;
              }
              .vitals-grid .vital-value {
                font-size: 13px;
                font-weight: bold;
              }
              .vitals-grid .vital-label {
                font-size: 10px;
                color: #555;
              }
              .medicine-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              .medicine-table th, .medicine-table td {
                padding: 10px;
                border: 1px solid #B2DFDB;
                text-align: left;
              }
              .medicine-table th {
                background-color: #E0F2F1; /* Lighter teal */
                font-weight: bold;
                font-size: 13px;
              }
              .medicine-table tr:nth-child(even) {
                background-color: #F8FBFB;
              }
              .footer {
                text-align: center;
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid #B2DFDB;
                font-size: 10px;
                color: #777;
              }
              .signature {
                margin-top: 40px;
                text-align: right;
              }
              .signature-line {
                width: 200px;
                border-top: 1px solid #333;
                margin-left: auto;
              }
              .signature-text {
                text-align: center;
                margin-top: 5px;
                font-weight: bold;
                width: 200px;
                margin-left: auto;
              }
              p {
                line-height: 1.5;
                margin: 0;
                padding: 0 2px;
              }
              .prescription-images-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                page-break-inside: avoid;
              }
              .prescription-img-small {
                width: 85px;
                height: 85px;
                object-fit: cover;
                border-radius: 6px;
                border: 2px solid #E0F2F1;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="header">
                  <div class="clinic-info">
                      <div class="clinic-name">The Smart MediHub</div>
                      <div class="clinic-address">Near Chhatriya Bus Stand, Sikar Road, Fatehpur Shekhawati, Sikar</div>
                  </div>
                  <!-- <img src="data:image/png;base64,..." class="logo" /> -->
              </div>

              <div class="title">Medical Prescription</div>

              <div class="section two-columns">
                  <div class="column">
                      <div class="section-title">Patient Details</div>
                      <div class="info-grid">
                          <span class="label">Patient Name:</span><span>John Doe</span>
                          <span class="label">Age/Gender:</span><span>35 / Male</span>
                          <span class="label">Date:</span><span>${new Date().toLocaleDateString()}</span>
                      </div>
                  </div>
                  <div class="column">
                      <div class="section-title">Vitals</div>
                      <div class="vitals-grid">
                          <div class="vital-item"><div class="vital-value">${pr || '--'}</div><div class="vital-label">PR (bpm)</div></div>
                          <div class="vital-item"><div class="vital-value">${bp || '--'}</div><div class="vital-label">BP (mmHg)</div></div>
                          <div class="vital-item"><div class="vital-value">${temp || '--'}</div><div class="vital-label">Temp (°C)</div></div>
                          <div class="vital-item"><div class="vital-value">${spo2 || '--'}</div><div class="vital-label">SPO2 (%)</div></div>
                          <div class="vital-item"><div class="vital-value">${rr || '--'}</div><div class="vital-label">RR (/min)</div></div>
                          <div class="vital-item"><div class="vital-value">${rbs || '--'}</div><div class="vital-label">RBS (mg/dL)</div></div>
                      </div>
                  </div>
              </div>

              <div class="section">
                  <div class="section-title">Diagnosis</div>
                  <p>${diagnosisText || diagnosisName || 'Not specified'}</p>
              </div>

              <div class="section">
                  <div class="section-title">Clinical Findings / History</div>
                  <p>${clinicalSummary || 'Not specified'}</p>
              </div>

              <div class="section">
                  <div class="section-title">Medicines (Rx)</div>
                  <table class="medicine-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${selectedMedsRows}
                      ${manualMedsRows}
                      ${noMedsRow}
                    </tbody>
                  </table>
              </div>

              <div class="section">
                  <div class="section-title">Investigations Advised</div>
                  <p>${diagnosisName || 'None advised'}</p>
              </div>

              <div class="section">
                  <div class="section-title">Notes</div>
                  <p>${prescriptionDetails || 'No additional notes'}</p>
              </div>

              <div class="section">
                  <div class="section-title">Attached Reports/Images</div>
                  <div class="prescription-images-row">
                    ${imagesBase64
                      .filter(Boolean)
                      .slice(0, 6)
                      .map(
                        (src) =>
                          `<img src="${src}" class="prescription-img-small" />`
                      )
                      .join('')}
                  </div>
              </div>

              <div class="signature">
                  <div class="signature-line"></div>
                  <div class="signature-text">Doctor's Signature</div>
              </div>

              <div class="footer">
                  This is a computer-generated prescription. No signature is required.
              </div>
            </div>
          </body>
        </html>
      `;

      const fileName = `Prescription_${new Date().getTime()}.pdf`;
      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
        base64: false,
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      if (file.filePath) {
        setPdfPath(file.filePath);
        
        navigation.navigate('PdfViewerScreen', {
          pdfPath: file.filePath,
          prescriptionData: {
            diagnosisText,
            selectedDiagnostic,
            clinicalSummary,
            selectedMedicines,
            prescriptionDetails,
            pr,
            bp,
            temp,
            spo2,
            rr,
            rbs,
          }
        });
      } else {
        Alert.alert('Error', 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', `Failed to generate PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.header}>Add Prescription</Text>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Vitals</Text>
          <TextInput
            placeholder="PR (Pulse Rate)"
            value={pr}
            onChangeText={setPr}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="BP (Blood Pressure)"
            value={bp}
            onChangeText={setBp}
            style={styles.input}
          />
          <TextInput
            placeholder="TEMP (°C)"
            value={temp}
            onChangeText={setTemp}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="SPO2%"
            value={spo2}
            onChangeText={setSpo2}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="RR (Resp. Rate)"
            value={rr}
            onChangeText={setRr}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="RBS (mg/dL)"
            value={rbs}
            onChangeText={setRbs}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Clinical Details</Text>
          <Text style={styles.sectionLabel}>
            Clinical Summary / Previous history
          </Text>
          <TextInput
            placeholder="Enter clinical summary or presentation..."
            value={clinicalSummary}
            onChangeText={setClinicalSummary}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
          <Text style={styles.sectionLabel}>Clinic Issues</Text>
          <TextInput
            placeholder="Enter clinic issues..."
            value={clinicIssues}
            onChangeText={setClinicIssues}
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />
          <Text style={styles.sectionLabel}>Allergy</Text>
          <TextInput
            placeholder="Enter allergy information..."
            value={allergy}
            onChangeText={setAllergy}
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />
          <Text style={styles.sectionLabel}>Refer Doctor</Text>
          <TextInput
            placeholder="Enter referred doctor name or specialization..."
            value={referDoctor}
            onChangeText={setReferDoctor}
            style={styles.input}
          />
        </View>


        <View style={styles.sectionCard}>
          {/* <Text style={styles.sectionHeader}>Previous History</Text> */}
          <Text style={[styles.sectionLabel, {paddingBottom: 3}]}>
          Investigation advice
          </Text>
          <DropDown
            data={diagnosisData}
            placeholder={diagnosisLoading ? "Loading..." : "Investigation advice"}
            selectedValue={selectedDiagnostic}
            onValueChange={item => setSelectedDiagnostic(item.value)}
            search={true}
          />
          {diagnosisLoading && (
            <Text style={styles.loadingText}>Loading diagnosis data...</Text>
          )}
          {diagnosisPagination.currentPage < diagnosisPagination.totalPages && (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={loadMoreDiagnosis}
              disabled={diagnosisLoading}
            >
              <Text style={styles.loadMoreButtonText}>
                {diagnosisLoading ? 'Loading...' : `Load More (${diagnosisPagination.currentPage}/${diagnosisPagination.totalPages})`}
              </Text>
            </TouchableOpacity>
          )}
          <Text
            style={[styles.sectionLabel, {paddingTop: 20, paddingBottom: 3}]}>
            Finel Diagnosis
          </Text>
          <TextInput
            placeholder="Enter diagnosis manually..."
            value={diagnosisText}
            onChangeText={setDiagnosisText}
            style={styles.input}
          />
        </View>

       
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Medicines</Text>
          <MultiSelect
            ref={medicineMultiSelectRef}
            style={styles.multiSelect}
            data={medicineData}
            labelField="label"
            valueField="value"
            placeholder="Select Medicines"
            search
            searchPlaceholder="Search medicines..."
            value={selectedMedicines}
            onChange={item => {
              setSelectedMedicines(item);
              medicineMultiSelectRef.current?.close();
            }}
            selectedStyle={styles.selectedMedicineChip}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity
                style={styles.selectedMedicineChip}
                onPress={() => unSelect && unSelect(item)}
              >
                <Text style={styles.selectedMedicineText}>{item.label}</Text>
                <Ionicons name="close" size={16} color="#888" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
          />
          
         
          
          <View style={{marginBottom: 18}}>
            <DropDown
              data={frequencyData}
              placeholder="Frequency (e.g., Twice a day, After meals)"
              selectedValue={manualFrequency}
              onValueChange={item => setManualFrequency(item.value)}
            />
          </View>
          <View style={{marginBottom: 18}}>
            <DropDown
              data={durationData}
              placeholder="Duration (e.g., 5 days, 1 week)"
              selectedValue={manualDuration}
              onValueChange={item => setManualDuration(item.value)}
            />
          </View>
        

          {/* Display Manual Medicines */}
          {manualMedicines.length > 0 && (
            <View style={styles.manualMedicinesContainer}>
              <Text style={[styles.sectionLabel, {marginTop: 15, marginBottom: 10}]}>
                Manual Medicines Added:
              </Text>
              {manualMedicines.map((med, index) => (
                <View key={med.id} style={styles.manualMedicineItem}>
                  <View style={styles.manualMedicineInfo}>
                    <Text style={styles.manualMedicineDetails}>
                      {med.name} • {med.dosage} • {med.frequency} • {med.duration}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeManualMedicineButton}
                    onPress={() => removeManualMedicine(med.id)}
                  >
                    <Ionicons name="close" size={20} color={colors.red} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <Text style={[styles.sectionLabel,{marginTop:15}]}>Prescription Details</Text>
          <TextInput
            placeholder="Enter prescription details..."
            value={prescriptionDetails}
            onChangeText={setPrescriptionDetails}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

     
        {/* Prescription Images Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Prescription Images</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleSelectImage}>
            <Text style={styles.uploadButtonText}>Select Images</Text>
          </TouchableOpacity>
          {/* Android custom modal for image picker */}
          {Platform.OS === 'android' && (
            <Modal
              visible={imagePickerModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setImagePickerModalVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 24, width: 260 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 18, textAlign: 'center' }}>Select Image Source</Text>
                  <TouchableOpacity
                    style={{ padding: 12, alignItems: 'center' }}
                    onPress={() => {
                      setImagePickerModalVisible(false);
                      pickImage(setPrescriptionImages, false, false, true); 
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 12, alignItems: 'center' }}
                    onPress={() => {
                      setImagePickerModalVisible(false);
                      pickImage(setPrescriptionImages, false, true); 
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Choose from Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 12, alignItems: 'center' }}
                    onPress={() => setImagePickerModalVisible(false)}
                  >
                    <Text style={{ fontSize: 16, color: 'red' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {prescriptionImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginBottom: 12}}>
              {prescriptionImages.map((img, idx) => (
                <View key={img.path || idx} style={styles.imageWrapper}>
                  <Image
                    source={{uri: img.path}}
                    style={styles.prescriptionImage}
                  />
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => removePrescriptionImage(idx)}>
                    <Ionicons name="close" size={20} color={colors.red} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Prescription</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleGeneratePDF}
          disabled={pdfLoading}>
          {pdfLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Generate PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: colors.secondary,
    minHeight: '100%',
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
    fontWeight: 'bold',
    fontSize: 22,
    color: colors.greenCustom,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGrey2,
    borderRadius: 8,
    marginBottom: 18,
    padding: 14,
    backgroundColor: colors.quaternary,
    fontSize: 16,
    minHeight: 48,
  },
  multiSelect: {
    borderWidth: 1.5,
    borderColor: colors.lightGrey2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.quaternary,
    minHeight: 50,
    marginBottom: 18,
  },
  selectedMedicineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quaternary,
    borderRadius: 8,
    margin: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    elevation: 1,
  },
  selectedMedicineText: {
    color: colors.greenCustom,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.lightGrey2,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 18,
    padding: 14,
    minHeight: 100,
    backgroundColor: colors.quaternary,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 2,
    color: colors.greenCustom,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: colors.lightGrey2,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: colors.quaternary,
  },
  uploadButtonText: {
    color: colors.black,
    fontSize: 16,
  },
  prescriptionImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
    alignSelf: 'center',
    borderRadius: 8,
  },
  signatureImage: {
    width: 120,
    height: 60,
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: colors.greenCustom,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    marginBottom: 10,
  },
  submitButtonText: {
    color: colors.white,  
    fontWeight: 'bold',
    fontSize: 18,
  },
  spacer12: {
    height: 12,
  },
  spacer18: {
    height: 18,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.lightGrey2,
  },
  sectionCard: {
    backgroundColor: colors.quaternary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.greenCustom,
    marginBottom: 12,
    marginTop: 0,
    letterSpacing: 0.2,
  },
  loadingText: {
    color: colors.greenCustom,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: colors.greenCustom,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  loadMoreButtonText: {
    color: colors.white,  
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualMedicinesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  manualMedicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  manualMedicineInfo: {
    flex: 1,
  },
  manualMedicineDetails: {
    color: colors.greenCustom,
  },
  removeManualMedicineButton: {
    padding: 5,
  },
  addManualButton: {
    backgroundColor: colors.greenCustom,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 18,
  },
  addManualButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
