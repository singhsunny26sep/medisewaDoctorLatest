import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import {colors} from '../const/Colors';
import CustomDateTimeInput from '../utils/CustomDateTimeInput';
import moment from 'moment';
import useDoctor from '../hook/useDoctor';
import {useLogin} from '../context/LoginProvider';
import useUser from '../hook/useUser';

const TimingSlot = ({doctorId}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [leaveDates, setLeaveDates] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeaveDate, setNewLeaveDate] = useState(new Date());
  const [leaveEndDate, setLeaveEndDate] = useState(new Date());
  const [leaveReason, setLeaveReason] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // Duration dropdown states
  const [durationOpen, setDurationOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [durationItems, setDurationItems] = useState([
    {label: '10 minutes', value: 10},
    {label: '15 minutes', value: 15},
    {label: '20 minutes', value: 20},
    {label: '30 minutes', value: 30},
  ]);

  const {createLeave, createTimeSlot} = useDoctor();
  const {user} = useLogin(); 
  const {getUserProfile} = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching complete user profile...');
        const profile = await getUserProfile();
        console.log('Complete User Profile:', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const correctDoctorId = userProfile?.doctorId?._id;
  const effectiveDoctorId = correctDoctorId || doctorId;

  // Reset duration when date changes
  useEffect(() => {
    setSelectedDuration(null);
    setSelectedSlots([]);
  }, [selectedDate]);

  // Generate time slots based on selected duration
  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    let currentTime = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');

    while (currentTime < end) {
      slots.push({
        time: currentTime.format('hh:mm A'),
        period: getPeriodFromTime(currentTime.format('HH:mm'))
      });
      currentTime.add(duration, 'minutes');
    }

    return slots;
  };

  // Get period based on time
  const getPeriodFromTime = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  // Updated generateSlotsForDate function
  const generateSlotsForDate = date => {
    const dayOfWeek = moment(date).day();
    const dateKey = moment(date).format('ddd, D MMM');

    const isOnLeave = leaveDates.some(
      leave => moment(leave.date).format('ddd, D MMM') === dateKey,
    );

    if (isOnLeave || !selectedDuration) {
      return {
        available: !isOnLeave,
        slots: [],
      };
    }

    let slots = [];
    const duration = selectedDuration;

    // Define time periods based on day of week
    if (dayOfWeek === 0) { // Sunday
      slots = [
        ...generateTimeSlots('09:00', '10:00', duration), // Morning
        ...generateTimeSlots('16:00', '17:00', duration), // Evening
      ];
    } else if (dayOfWeek === 6) { // Saturday
      slots = [
        ...generateTimeSlots('10:00', '12:00', duration), // Morning
        ...generateTimeSlots('14:00', '15:00', duration), // Afternoon
        ...generateTimeSlots('17:00', '18:00', duration), // Evening
      ];
    } else { // Weekdays
      slots = [
        ...generateTimeSlots('09:00', '12:00', duration), // Morning
        ...generateTimeSlots('14:00', '17:00', duration), // Afternoon
        ...generateTimeSlots('17:00', '19:00', duration), // Evening
      ];
    }

    return {
      available: true,
      slots: slots,
    };
  };

  const getCurrentSlotData = () => {
    return generateSlotsForDate(selectedDate);
  };

  const toggleDate = date => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const toggleSlotSelection = slot => {
    const dateKey = moment(selectedDate).format('ddd, D MMM');
    const slotKey = `${dateKey}-${slot.time}`;

    setSelectedSlots(prev => {
      const isAlreadySelected = prev.find(s => s.key === slotKey);

      if (isAlreadySelected) {
        return prev.filter(s => s.key !== slotKey);
      } else {
        return [
          ...prev,
          {
            key: slotKey,
            date: dateKey,
            time: slot.time,
            period: slot.period,
            fullDate: moment(selectedDate).format('YYYY-MM-DD'),
            duration: selectedDuration,
          },
        ];
      }
    });
  };

  const isSlotSelected = slotTime => {
    const dateKey = moment(selectedDate).format('ddd, D MMM');
    return selectedSlots.some(
      slot => slot.date === dateKey && slot.time === slotTime,
    );
  };

  const isSlotSaved = (dateKey, slotTime) => {
    return savedSlots.some(
      slot => slot.date === dateKey && slot.time === slotTime,
    );
  };

  const getSlotsByPeriod = (slots, period) => {
    return slots.filter(slot => slot.period === period);
  };

  const handleSaveSlots = async () => {
    console.log('Saving slots for doctor ID:', effectiveDoctorId);
    console.log('Selected slots:', selectedSlots);

    if (selectedSlots.length === 0) {
        Alert.alert('No Slots Selected', 'Please select at least one time slot.');
        return;
    }

    try {
        const timeSlotData = prepareTimeSlotData(selectedSlots);
        console.log('Time slot data for API:', timeSlotData);

        const result = await createTimeSlot(effectiveDoctorId, timeSlotData);

        if (result) {
            setSavedSlots(prev => {
                const newSlots = selectedSlots.filter(newSlot =>
                    !prev.some(savedSlot => savedSlot.key === newSlot.key)
                );
                return [...prev, ...newSlots];
            });

            console.log('All Saved Slots:', savedSlots);
            Alert.alert(
                'Success',
                `${selectedSlots.length} slot(s) have been saved successfully!`
            );
            
            setSelectedSlots([]);
        }
    } catch (error) {
        console.error('Failed to save time slots:', error);
        Alert.alert('Error', 'Failed to save time slots. Please try again.');
    }
  };

  const prepareTimeSlotData = (slots) => {
    const groupedByDate = slots.reduce((acc, slot) => {
        if (!acc[slot.fullDate]) {
            acc[slot.fullDate] = [];
        }
        acc[slot.fullDate].push(slot);
        return acc;
    }, {});

    const date = Object.keys(groupedByDate)[0];
    const dateSlots = groupedByDate[date];

    const timeSlotData = {
        date: date,
        morning: {
            at9AM: false,
            at9_30AM: false,
            at10AM: false,
            at10_30AM: false,
            at11AM: false
        },
        afternoon: {
            at2PM: false,
            at2_30PM: false,
            at3PM: false
        },
        evening: {
            at4PM: false,
            at4_30PM: false,
            at5PM: false,
            at5_30PM: false
        }
    };

    dateSlots.forEach(slot => {
        const time = slot.time;
        
        if (time === '09:00 AM') timeSlotData.morning.at9AM = true;
        if (time === '09:30 AM') timeSlotData.morning.at9_30AM = true;
        if (time === '10:00 AM') timeSlotData.morning.at10AM = true;
        if (time === '10:30 AM') timeSlotData.morning.at10_30AM = true;
        if (time === '11:00 AM') timeSlotData.morning.at11AM = true;
        
        if (time === '02:00 PM') timeSlotData.afternoon.at2PM = true;
        if (time === '02:30 PM') timeSlotData.afternoon.at2_30PM = true;
        if (time === '03:00 PM') timeSlotData.afternoon.at3PM = true;
        
        if (time === '04:00 PM') timeSlotData.evening.at4PM = true;
        if (time === '04:30 PM') timeSlotData.evening.at4_30PM = true;
        if (time === '05:00 PM') timeSlotData.evening.at5PM = true;
        if (time === '05:30 PM') timeSlotData.evening.at5_30PM = true;
    });

    return timeSlotData;
  };

  const handleRemoveSavedSlot = slotKey => {
    setSavedSlots(prev => prev.filter(slot => slot.key !== slotKey));
  };

  const handleAddLeave = async () => {
    if (!leaveReason.trim()) {
      Alert.alert('Error', 'Please enter a reason for leave.');
      return;
    }

    if (!effectiveDoctorId) {
      Alert.alert(
        'Error',
        'Doctor ID is missing. Cannot add leave. Please wait while we load your profile.',
      );
      console.error('Missing doctor ID. User data:', user);
      console.error('User Profile:', userProfile);
      return;
    }

    const startDate = moment(newLeaveDate).format('YYYY-MM-DD');
    const endDate = moment(leaveEndDate).format('YYYY-MM-DD');

    if (moment(endDate).isBefore(startDate)) {
      Alert.alert('Error', 'End date cannot be before start date.');
      return;
    }

    const leaveData = {
      reason: leaveReason,
      startDate: startDate,
      endDate: endDate,
    };

    console.log('Submitting leave for doctor ID:', effectiveDoctorId);
    console.log('Leave data to API:', leaveData);

    try {
      const result = await createLeave(effectiveDoctorId, leaveData);

      if (result) {
        const newLeave = {
          id: Date.now().toString(),
          date: new Date(newLeaveDate),
          endDate: new Date(leaveEndDate),
          reason: leaveReason,
          dateKey: `${moment(newLeaveDate).format('ddd, D MMM')} - ${moment(
            leaveEndDate,
          ).format('ddd, D MMM')}`,
        };

        setLeaveDates(prev => [...prev, newLeave]);
        setLeaveReason('');
        setShowLeaveModal(false);
      }
    } catch (error) {
      console.error('Failed to create leave:', error);
      Alert.alert('Error', 'Failed to create leave. Please try again.');
    }
  };

  const handleRemoveLeave = leaveId => {
    setLeaveDates(prev => prev.filter(leave => leave.id !== leaveId));
  };

  const getPeriodColor = period => {
    switch (period) {
      case 'Morning':
        return '#4CAF50';
      case 'Afternoon':
        return '#FF9800';
      case 'Evening':
        return '#2196F3';
      default:
        return colors.greenCustom;
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    setExpandedDate(moment(date).format('ddd, D MMM'));
  };

  const currentDateKey = moment(selectedDate).format('ddd, D MMM');
  const currentSlotData = getCurrentSlotData();

  const DateHeader = ({date, data}) => (
    <TouchableOpacity
      style={styles.dateHeader}
      onPress={() => toggleDate(date)}
      disabled={!data.available || !selectedDuration}>
      <View style={styles.dateHeaderLeft}>
        <Text
          style={[styles.dateText, !data.available && styles.leaveDateText]}>
          {date}
        </Text>
        <Text style={styles.slotCount}>
          {!selectedDuration 
            ? 'Select duration to view slots'
            : data.available
            ? `${data.slots.length} slots available`
            : 'Doctor on Leave'
          }
        </Text>
      </View>
      {data.available && data.slots.length > 0 && selectedDuration && (
        <Icon
          name={expandedDate === date ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.greenCustom}
        />
      )}
    </TouchableOpacity>
  );

  const TimeSlot = ({slot}) => {
    const isSelected = isSlotSelected(slot.time);
    const isSaved = isSlotSaved(currentDateKey, slot.time);

    return (
      <TouchableOpacity
        style={[
          styles.timeSlot,
          isSelected && styles.selectedTimeSlot,
          isSaved && styles.savedTimeSlot,
          {borderColor: getPeriodColor(slot.period)},
        ]}
        onPress={() => !isSaved && toggleSlotSelection(slot)}
        disabled={isSaved}>
        <Text
          style={[
            styles.timeText,
            isSelected && styles.selectedTimeText,
            isSaved && styles.savedTimeText,
            {
              color: isSaved
                ? '#888'
                : isSelected
                ? '#fff'
                : getPeriodColor(slot.period),
            },
          ]}>
          {slot.time}
        </Text>
        {isSelected && !isSaved && (
          <Icon name="checkmark" size={16} color="#fff" />
        )}
        {isSaved && <Icon name="lock-closed" size={14} color="#888" />}
      </TouchableOpacity>
    );
  };

  const PeriodSection = ({period, slots}) => {
    const periodSlots = getSlotsByPeriod(slots, period);
    if (periodSlots.length === 0) return null;

    return (
      <View style={styles.periodSection}>
        <View style={styles.periodHeader}>
          <View
            style={[
              styles.periodDot,
              {backgroundColor: getPeriodColor(period)},
            ]}
          />
          <Text style={[styles.periodText, {color: getPeriodColor(period)}]}>
            {period} ({periodSlots.length} slots)
          </Text>
        </View>
        <View style={styles.timeSlotsContainer}>
          {periodSlots.map((slot, index) => (
            <TimeSlot key={index} slot={slot} />
          ))}
        </View>
      </View>
    );
  };

  const DurationSelector = () => (
    <View style={styles.durationContainer}>
      <Text style={styles.durationLabel}>Select Time Slot Duration</Text>
      <DropDownPicker
        open={durationOpen}
        value={selectedDuration}
        items={durationItems}
        setOpen={setDurationOpen}
        setValue={setSelectedDuration}
        setItems={setDurationItems}
        placeholder="Choose duration"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        labelStyle={styles.dropdownLabel}
      />
      {selectedDuration && (
        <Text style={styles.durationInfo}>
          Selected: {selectedDuration} minutes per slot
        </Text>
      )}
    </View>
  );

  const LeaveManagement = () => (
    <View style={styles.leaveManagement}>
      <Text style={styles.leaveTitle}>Leave Management</Text>
      <TouchableOpacity
        style={[
          styles.addLeaveButton,
          !effectiveDoctorId && styles.addLeaveButtonDisabled,
        ]}
        onPress={() => setShowLeaveModal(true)}
        disabled={!effectiveDoctorId}>
        <Icon name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addLeaveButtonText}>
          {!effectiveDoctorId ? 'Loading...' : 'Add Leave'}
        </Text>
      </TouchableOpacity>

      {leaveDates.length > 0 && (
        <ScrollView
          style={styles.leaveList}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {leaveDates.map(leave => (
            <View key={leave.id} style={styles.leaveItem}>
              <Text style={styles.leaveDate}>
                {moment(leave.date).format('ddd, D MMM')} -{' '}
                {moment(leave.endDate).format('ddd, D MMM')}
              </Text>
              <Text style={styles.leaveReason}>{leave.reason}</Text>
              <TouchableOpacity
                style={styles.removeLeaveButton}
                onPress={() => handleRemoveLeave(leave.id)}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const SavedSlotsSection = () => {
    if (savedSlots.length === 0) return null;

    const groupedSlots = savedSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});

    return (
      <View style={styles.savedSlotsContainer}>
        <Text style={styles.savedSlotsTitle}>
          All Saved Slots ({savedSlots.length})
        </Text>
        <ScrollView
          style={styles.savedSlotsScroll}
          showsVerticalScrollIndicator={false}>
          {Object.entries(groupedSlots).map(([date, slots]) => (
            <View key={date} style={styles.savedDateGroup}>
              <Text style={styles.savedDateTitle}>{date}</Text>
              <View style={styles.savedSlotsList}>
                {slots.map(slot => (
                  <View
                    key={slot.key}
                    style={[
                      styles.savedSlotItem,
                      {backgroundColor: getPeriodColor(slot.period)},
                    ]}>
                    <Text style={styles.savedSlotText}>
                      {slot.time} ({slot.period}) - {slot.duration}min
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSavedSlot(slot.key)}
                      style={styles.removeSavedSlotButton}>
                      <Icon name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clinic Visit Slots</Text>
        <Text style={styles.subtitle}>Purpose of visit: Consultation</Text>

        <View style={styles.dateContainer}>
          <CustomDateTimeInput
            label="Select Date"
            mode="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </View>

        {/* Duration Selector - Only show when date is selected */}
        {selectedDate && <DurationSelector />}

        <LeaveManagement />

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#4CAF50'}]} />
            <Text style={styles.legendText}>Morning</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#FF9800'}]} />
            <Text style={styles.legendText}>Afternoon</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#2196F3'}]} />
            <Text style={styles.legendText}>Evening</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.dateSection}>
          <DateHeader date={currentDateKey} data={currentSlotData} />

          {expandedDate === currentDateKey &&
            currentSlotData.available &&
            currentSlotData.slots.length > 0 &&
            selectedDuration && (
              <View style={styles.slotsContainer}>
                <PeriodSection period="Morning" slots={currentSlotData.slots} />
                <PeriodSection
                  period="Afternoon"
                  slots={currentSlotData.slots}
                />
                <PeriodSection period="Evening" slots={currentSlotData.slots} />
              </View>
            )}

          {currentSlotData.available && currentSlotData.slots.length === 0 && selectedDuration && (
            <View style={styles.noSlotsContainer}>
              <Text style={styles.noSlotsText}>
                No slots available for {currentDateKey} with {selectedDuration} minute duration
              </Text>
            </View>
          )}

          {!selectedDuration && expandedDate === currentDateKey && (
            <View style={styles.noSlotsContainer}>
              <Text style={styles.noSlotsText}>
                Please select a time slot duration to view available slots
              </Text>
            </View>
          )}
        </View>

        <SavedSlotsSection />
      </ScrollView>

      {selectedSlots.length > 0 && (
        <View style={styles.selectedSlotsContainer}>
          <Text style={styles.selectedSlotsTitle}>
            Currently Selected ({selectedSlots.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedSlotsList}>
              {selectedSlots.map((slot, index) => (
                <View
                  key={slot.key}
                  style={[
                    styles.selectedSlotBadge,
                    {backgroundColor: getPeriodColor(slot.period)},
                  ]}>
                  <Text style={styles.selectedSlotText}>
                    {slot.date} - {slot.time}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const [date, time] = slot.key.split('-');
                      toggleSlotSelection({time: time});
                    }}
                    style={styles.removeSlotButton}>
                    <Icon name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          (selectedSlots.length === 0 || !effectiveDoctorId) &&
            styles.saveButtonDisabled,
        ]}
        onPress={handleSaveSlots}
        disabled={selectedSlots.length === 0 || !effectiveDoctorId}>
        <Text style={styles.saveButtonText}>
          {!effectiveDoctorId
            ? 'Loading...'
            : `Save Selected Slots (${selectedSlots.length})`}
        </Text>
      </TouchableOpacity>

      {/* Leave Modal */}
      <Modal visible={showLeaveModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Leave</Text>

            <CustomDateTimeInput
              label="Start Date"
              mode="date"
              value={newLeaveDate}
              onChange={setNewLeaveDate}
            />

            <CustomDateTimeInput
              label="End Date"
              mode="date"
              value={leaveEndDate}
              onChange={setLeaveEndDate}
            />

            <Text style={styles.label}>Reason for Leave</Text>
            <TextInput
              style={styles.textInput}
              value={leaveReason}
              onChangeText={setLeaveReason}
              placeholder="Enter reason for leave"
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLeaveModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.addButton,
                  !effectiveDoctorId && styles.addButtonDisabled,
                ]}
                onPress={handleAddLeave}
                disabled={!effectiveDoctorId}>
                <Text style={styles.addButtonText}>
                  {!effectiveDoctorId ? 'Loading...' : 'Add Leave'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: colors.greenCustom,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  dateContainer: {
    marginBottom: 15,
  },
  // Duration Selector Styles
  durationContainer: {
    marginBottom: 15,
    zIndex: 1000, // Ensure dropdown appears above other elements
  },
  durationLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  durationInfo: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 8,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownLabel: {
    fontWeight: '600',
  },
  leaveManagement: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  leaveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  addLeaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 5,
  },
  addLeaveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addLeaveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  leaveList: {
    marginTop: 10,
  },
  leaveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 150,
  },
  leaveDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  leaveReason: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  removeLeaveButton: {
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  dateSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  dateHeaderLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  leaveDateText: {
    color: '#FF6B6B',
    textDecorationLine: 'line-through',
  },
  slotCount: {
    fontSize: 12,
    color: colors.greenCustom,
    marginTop: 2,
  },
  slotsContainer: {
    padding: 15,
  },
  periodSection: {
    marginBottom: 20,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  periodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    gap: 5,
  },
  selectedTimeSlot: {
    backgroundColor: colors.greenCustom,
    borderColor: colors.greenCustom,
  },
  savedTimeSlot: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  timeText: {
    fontSize: 14,
  },
  selectedTimeText: {
    color: '#fff',
  },
  savedTimeText: {
    color: '#888',
  },
  selectedSlotsContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedSlotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectedSlotsList: {
    flexDirection: 'row',
    gap: 10,
  },
  selectedSlotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  selectedSlotText: {
    fontSize: 12,
    color: '#fff',
  },
  removeSlotButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedSlotsContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  savedSlotsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  savedSlotsScroll: {
    maxHeight: 200,
  },
  savedDateGroup: {
    marginBottom: 15,
  },
  savedDateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  savedSlotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  savedSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  savedSlotText: {
    fontSize: 12,
    color: '#fff',
  },
  removeSavedSlotButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    margin: 15,
    padding: 15,
    backgroundColor: colors.greenCustom,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  noSlotsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  noSlotsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.greenCustom,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#00B074',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.greenCustom,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TimingSlot;