import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../const/Colors'
import useUser from '../hook/useUser'
import CustomInput from '../utils/CustomInput'
import ProfileImage from '../common/ProfileImage'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import showToast from '../utils/ShowToast'
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker'
import useDepartment from '../hook/useDepartment'
import CustomSelection from '../common/CustomSelection'
import useSpecialization from '../hook/useSpecialization'
import CustomButton from '../utils/CustomButton'
import CustomDateTimeInput from '../utils/CustomDateTimeInput'
import moment from 'moment'
import useDoctor from '../hook/useDoctor'

const genders = [{ name: "Female", _id: 1 }, { name: "Male", _id: 2 }, { name: "Other", _id: 3 }]
let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const ProfileUpdate = () => {
    const { getDoctorDetails, doctorProfileImageUpload } = useUser()
    const { updateDoctorProfile } = useDoctor()
    const { getAllDepartments } = useDepartment()
    const { getAllSpecialization } = useSpecialization()
    const [loading, setLoading] = useState<boolean>(true)
    const [updateLoading, setUpdateLoading] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false);
    const actionSheetRef: any = useRef<ActionSheetRef>(null);
    const signatureActionSheetRef: any = useRef<ActionSheetRef>(null);


    const [departments, setDepartments] = useState<any>([])
    const [specializations, setSpecializations] = useState<any>([])


    const [name, setName] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [mobile, setMobile] = useState<string>()
    const [clinicMobile, setClinicMobile] = useState<string>()
    const [address, setAddress] = useState<string>()
    const [clinicaddress, setClinicAddress] = useState<string>()
    const [gender, setGender] = useState<any>()
    const [specialization, setSpecialization] = useState<any>()
    const [deparment, setDepartment] = useState<any>()
    const [startTime, setStartTime] = useState<Date | null>();
    const [endTime, setEndTime] = useState<Date | null>();
    const [dob, setDob] = useState<any>()
    const [experience, setExperience] = useState<any>()
    const [before, setBefore] = useState<any>()
    const [fee, setFee] = useState<any>()
    const [oldFee, setOldFee] = useState<any>()
    const [symptoms, setSymptoms] = useState<string[]>([])

    const [image, setImage] = useState<any>()
    const [signature, setSignature] = useState<any>()

    const [imgLoading, setImgLoading] = useState<boolean>(false)
    const [signatureLoading, setSignatureLoading] = useState<boolean>(false)


    const [valName, setValName] = useState<string>()
    const [valMobile, setValMobile] = useState<string>()
    const [valEmail, setValEmail] = useState<string>()
    const [valAddress, setValAddress] = useState<string>()
    const [valClinicMobile, setValClinicMobile] = useState<string>()
    const [valClinicAddress, setValClinicAddress] = useState<string>()
    const [valGender, setValGender] = useState<string>()
    const [valSpecialization, setValSpecialization] = useState<string>()
    const [valDeparment, setValDeparment] = useState<string>()
    const [valStartTime, setValStartTime] = useState<string>()
    const [valEndTime, setValEndTime] = useState<string>()
    const [valDob, setValDob] = useState<string>()
    const [valExperience, setValExperience] = useState<string>()
    const [valBefore, setValBefore] = useState<string>()
    const [valFee, setValFee] = useState<string>()
    const [valOldFee, setValOldFee] = useState<string>()
    const [valSymptoms, setValSymptoms] = useState<string>()
    const [valSignature, setValSignature] = useState<string>()



    const getUser = async () => {
        try {
            const response = await getDoctorDetails()
            if (!response) {
                setLoading(false)
                return
            }
            setImage(response?.image ? { path: response?.image } : undefined)
            setSignature(response?.signature ? { path: response?.signature } : undefined)
            setName(response?.name || "")
            setEmail(response?.email || "")
            setMobile(response?.contactNumber ? response?.contactNumber?.toString() : "")
            setClinicMobile(response?.clinicContactNumber ? response?.clinicContactNumber?.toString() : "")
            setAddress(response?.address || "")
            setClinicAddress(response?.clinicAddress || "")
            setGender(response?.gender ? {
                label: response?.gender,
                value: genders?.find((item) => item.name === response?.gender)?._id || null
            } : undefined)
            setSpecialization(response?.specialization?._id ? { label: response?.specialization?.name, value: response?.specialization?._id } : undefined)
            setDepartment(response?.department?._id ? { label: response?.department?.name, value: response?.department?._id } : undefined)
            setDob(response?.dob || null)
            setExperience(response?.experience !== undefined && response?.experience !== null ? response?.experience?.toString() : "")
            setBefore(response?.bookingBeforeTime !== undefined && response?.bookingBeforeTime !== null ? response?.bookingBeforeTime?.toString() : "")
            setFee(response?.fee !== undefined && response?.fee !== null ? response?.fee?.toString() : "")
            setOldFee(response?.oldFee !== undefined && response?.oldFee !== null ? response?.oldFee?.toString() : "")
            setSymptoms(Array.isArray(response?.symptoms) ? response?.symptoms : [])
            setStartTime(moment(response?.startTime, ["HH:mm", "HH:mm:ss"], true).isValid() ? moment(response?.startTime, ["HH:mm", "HH:mm:ss"], true).toDate() : null)
            setEndTime(moment(response?.endTime, ["HH:mm", "HH:mm:ss"], true).isValid() ? moment(response?.endTime, ["HH:mm", "HH:mm:ss"], true).toDate() : null)
        } catch (error) {
            console.log("error while fetching doctor details: ", error)
        } finally {
            setImgLoading(false)
            setSignatureLoading(false)
            setLoading(false)
            setDepartments(await getAllDepartments())
            setSpecializations(await getAllSpecialization())
        }
    }


    const showActionSheet = () => {
        actionSheetRef.current?.show();
    };

    const hideActionSheet = () => {
        actionSheetRef.current?.hide();
    };

    const showSignatureActionSheet = () => {
        signatureActionSheetRef.current?.show();
    };

    const hideSignatureActionSheet = () => {
        signatureActionSheetRef.current?.hide();
    };

    useEffect(() => {
        getUser()
    }, [loading,])

    const openCamera = async (type: 'profile' | 'signature') => {
        try {
            const image = await ImagePicker.openCamera({
                mediaType: 'photo',
                cropping: true,
                compressImageQuality: 0.5,
                cropperCircleOverlay: type === 'profile', // Circular crop only for profile
                width: 1000,
                height: 1000,
            });

            if (type === 'profile') {
                setImgLoading(true);
                setImage(image)
                hideActionSheet();
                setImgLoading(false);
            } else {
                setSignatureLoading(true);
                setSignature(image)
                hideSignatureActionSheet();
                setSignatureLoading(false);
            }
            setRefresh(!refresh);

        } catch (error: any) {
            if (error.code === 'E_PICKER_CANCELLED') {
                showToast('Image not captured!');
            } else {
                showToast(`Error on image picking: ${error.message}`);
            }
            if (type === 'profile') {
                hideActionSheet();
                setImgLoading(false);
            } else {
                hideSignatureActionSheet();
                setSignatureLoading(false);
            }
            console.log('Error on openCamera:', error);
        }
    };

    const openGallory = async (type: 'profile' | 'signature') => {
        try {
            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                cropping: true,
                compressImageQuality: 0.5,
                cropperCircleOverlay: type === 'profile', // Circular crop only for profile
                width: 1000,
                height: 1000,
            });

            if (type === 'profile') {
                setImage(image)
                setImgLoading(true);
                hideActionSheet();
                setImgLoading(false);
            } else {
                setSignature(image)
                setSignatureLoading(true);
                hideSignatureActionSheet();
                setSignatureLoading(false);
            }
            setRefresh(!refresh);

        } catch (error: any) {
            if (error.code === 'E_PICKER_CANCELLED') {
                showToast('Image not selected!');
            } else {
                showToast(`Error on image picking: ${error.message}`);
            }
            if (type === 'profile') {
                hideActionSheet();
                setImgLoading(false);
            } else {
                hideSignatureActionSheet();
                setSignatureLoading(false);
            }
            console.log('Error on openGallory:', error);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            setValName("Name is required")
            return
        }
        if (!email) {
            setValEmail("Email is required")
            return
        }
        if (!email.match(regex)) {
            setValEmail("Enter a valid email address")
            return
        }
        if (!mobile) {
            setValMobile("Mobile number is required")
            return
        }
        if (mobile.toString().length < 10) {
            setValMobile("Enter a valid 10 digit mobile number")
            return
        }
        if (!clinicMobile) {
            setValClinicMobile("Clinic mobile number is required")
            return
        }
        if (clinicMobile.toString().length < 10) {
            setValClinicMobile("Enter a valid 10 digit clinic mobile number")
            return
        }
        if (!address) {
            setValAddress("Address is required")
            return
        }
        if (!clinicaddress) {
            setValClinicAddress("Clinic address is required")
            return
        }
        if (!gender) {
            setValGender("Gender is required")
            return
        }
        if (!specialization) {
            setValSpecialization("Specialization is required")
            return
        }
        if (!deparment) {
            setValDeparment("Department is required")
            return
        }
        if (!dob) {
            setValDob("Date of birth is required")
            return
        }
        if (!startTime) {
            setValStartTime("Start time is required")
            return
        }
        if (!endTime) {
            setValEndTime("End time is required")
            return
        }
        if (endTime < startTime) {
            setValEndTime("End time must be greater than start time")
            return
        }
        if (!experience) {
            setValExperience("Experience is required")
            return
        }
        if (!fee) {
            setValFee("Fee is required")
            return
        }
        if (!symptoms || symptoms.length === 0) {
            setValSymptoms("At least one symptom is required")
            return
        }
        if (!signature) {
            setValSignature("Signature is required")
            return
        }
        setLoading(true)
        const result = await updateDoctorProfile({ 
            image, 
            signature,
            name, 
            email, 
            mobile, 
            clinicMobile, 
            gender: gender?.label, 
            specialization: specialization?.value, 
            deparment: deparment?.value, 
            address, 
            clinicaddress, 
            dob: moment(dob, [moment.ISO_8601, "YYYY-MM-DD", "DD-MM-YYYY", "MM/DD/YYYY", "YYYY/MM/DD"], true).isValid() ? moment(dob).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), 
            startTime: moment(startTime).format("HH:mm"), 
            endTime: moment(endTime).format("HH:mm"), 
            fee, 
            oldFee, 
            experience, 
            before,
            symptoms 
        })
        if (result) {
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    return (
        <ScrollView>
            <View style={{ flex: 1,backgroundColor:colors.white }}>
                <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
                
                {/* Profile Image Section */}
                <View style={{ width: '100%', marginTop: 10 }}>
                    <View style={styles.imgView}>
                        <ProfileImage url={image?.path} onPress={showActionSheet} isLoading={imgLoading} />
                        <Text style={styles.imageLabel}>Profile Picture</Text>
                    </View>
                </View>

               

                <View style={{ width: '100%', paddingHorizontal: '5%' }}>
                    <CustomInput label="Name" value={name} placeholder="Enter your name" onChangeText={(e: string) => { setName(e); setValName("") }} error={valName ? true : false} errorMessage={valName} autoCapitalize='words' />

                    <CustomInput label="Email" value={email} placeholder="Enter your email" onChangeText={(e: string) => { setEmail(e); setValEmail("") }} error={valEmail ? true : false} errorMessage={valEmail} autoCapitalize='none' keyboardType='email-address' />

                    <CustomInput label="Mobile" value={mobile} placeholder="Enter your mobile" keyboardType='numeric' onChangeText={(e: string) => { setMobile(e); setValMobile("") }} error={valMobile ? true : false} errorMessage={valMobile} maxLength={10} />

                    <CustomInput label="Clinic Mobile Number" value={clinicMobile} placeholder="Enter clinic mobile number" keyboardType='numeric' onChangeText={(e: string) => { setClinicMobile(e); setValClinicMobile("") }} error={valClinicMobile ? true : false} errorMessage={valClinicMobile} maxLength={10} />

                    <CustomSelection title={"Select Gender"} data={genders} defaultValue={gender} setDataValue={setGender} label={"Gender"} searchAble={false} error={valGender ? true : false} errorMessage={valGender} setErrorMsg={setValGender} />

                    <CustomSelection title={"Select Specializations"} data={specializations} defaultValue={specialization} setDataValue={setSpecialization} label={"Specializations"} searchAble={true} error={valSpecialization ? true : false} errorMessage={valSpecialization} setErrorMsg={setValSpecialization} />

                    <CustomSelection
                        title={"Select Department"}
                        data={departments}
                        defaultValue={deparment}
                        setDataValue={setDepartment}
                        label={"Department"}
                        searchAble={true}
                        error={valDeparment ? true : false}
                        errorMessage={valDeparment}
                        setErrorMsg={setValDeparment}
                    />

                    <CustomInput label="Address" value={address} placeholder="Enter your address" onChangeText={(e: string) => { setAddress(e); setValAddress("") }} error={valAddress ? true : false} errorMessage={valAddress} autoCapitalize='words' />

                    <CustomInput label="Clinic Address" value={clinicaddress} placeholder="Enter clinic address" onChangeText={(e: string) => { setClinicAddress(e); setValAddress("") }} error={valAddress ? true : false} errorMessage={valAddress} autoCapitalize='words' />

                    <CustomDateTimeInput label="Date of Birth" mode="date" value={dob} onChange={setDob} error={valDob ? true : false} errorMessage={valDob} />

                    <CustomDateTimeInput label="Start Time" mode="time" value={startTime} onChange={(date) => { setStartTime(date); setValStartTime(""); }} error={valStartTime ? true : false} errorMessage={valStartTime} />
                    <CustomDateTimeInput label="End Time" mode="time" value={endTime} onChange={(date) => { setEndTime(date); setValEndTime(""); }} error={valEndTime ? true : false} errorMessage={valEndTime} />

                    <CustomInput label="Patient Fee" value={fee} placeholder="Enter patient fee" onChangeText={(e: string) => { setFee(e); setValFee("") }} error={valFee ? true : false} errorMessage={valFee} keyboardType='number-pad' />

                    <CustomInput label="Regular Patient Fee" value={oldFee} placeholder="Enter regular patient fee" onChangeText={(e: string) => { setOldFee(e); setValOldFee("") }} error={valOldFee ? true : false} errorMessage={valOldFee} keyboardType='number-pad' />

                    <CustomInput label="Experience" value={experience} placeholder="Enter experience in years" onChangeText={(e: string) => { setExperience(e); setValExperience("") }} error={valExperience ? true : false} errorMessage={valExperience} keyboardType='number-pad' />

                    <CustomInput label="Take Appointment Before" value={before} placeholder="e.g. 1" onChangeText={(e: string) => { setBefore(e); }} error={false} errorMessage={""} keyboardType='number-pad' />
                    <Text style={{ color: colors.black }}>Note:- It takes only hours</Text>

                    <CustomInput 
                        label="Symptoms (comma separated)" 
                        value={symptoms.join(', ')} 
                        placeholder="Enter symptoms e.g. fever, neck pain" 
                        onChangeText={(e: string) => { 
                            const symptomArray = e.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            setSymptoms(symptomArray); 
                            setValSymptoms("") 
                        }} 
                        error={valSymptoms ? true : false} 
                        errorMessage={valSymptoms} 
                        autoCapitalize='words' 
                    />
 {/* Signature Image Section */}
 <View style={{ width: '100%', marginTop: 20 }}>
                    <View style={styles.imgView}>
                        <TouchableOpacity onPress={showSignatureActionSheet}>
                            <View style={styles.signatureContainer}>
                                {signature?.path ? (
                                    <ProfileImage url={signature?.path} onPress={showSignatureActionSheet} isLoading={signatureLoading} />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <EvilIcons name="pencil" size={50} color={colors.gray} />
                                        <Text style={styles.placeholderText}>Add Signature</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.imageLabel}>Signature</Text>
                        {valSignature && <Text style={styles.errorText}>{valSignature}</Text>}
                    </View>
                </View>
                </View>

                <View style={{ width: '70%', alignSelf: 'center', marginVertical: 10 }}>
                    <CustomButton isLoading={loading} onPress={handleSubmit} title='Submit' backgroundColor={colors.greenCustom} textColor={colors.white} />
                </View>

                {/* Profile Image Action Sheet */}
                <ActionSheet ref={actionSheetRef} gestureEnabled={true} containerStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, }}>
                    <View style={{ width: '100%', marginHorizontal: '5%', marginTop: 5, display: 'flex', alignItems: 'flex-end', }}>
                        <TouchableOpacity onPress={hideActionSheet}>
                            <Icon name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cameratOptions}>
                        <TouchableOpacity style={styles.openCamera} onPress={() => openCamera('profile')}>
                            <EvilIcons name="camera" size={40} color={colors.black} />
                            <Text style={{ color: 'grey', marginVertical: 5 }}>Open Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.openCamera} onPress={() => openGallory('profile')}>
                            <EvilIcons name="image" size={40} color={colors.black} />
                            <Text style={{ color: 'grey', marginVertical: 5 }}>Open Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>

                {/* Signature Action Sheet */}
                <ActionSheet ref={signatureActionSheetRef} gestureEnabled={true} containerStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, }}>
                    <View style={{ width: '100%', marginHorizontal: '5%', marginTop: 5, display: 'flex', alignItems: 'flex-end', }}>
                        <TouchableOpacity onPress={hideSignatureActionSheet}>
                            <Icon name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cameratOptions}>
                        <TouchableOpacity style={styles.openCamera} onPress={() => openCamera('signature')}>
                            <EvilIcons name="camera" size={40} color={colors.black} />
                            <Text style={{ color: 'grey', marginVertical: 5 }}>Open Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.openCamera} onPress={() => openGallory('signature')}>
                            <EvilIcons name="image" size={40} color={colors.black} />
                            <Text style={{ color: 'grey', marginVertical: 5 }}>Open Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
            </View>
        </ScrollView>
    )
}

export default ProfileUpdate

const styles = StyleSheet.create({
    imgView: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    cameratOptions: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    openCamera: {
        marginVertical: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 80,
        elevation: 1,
    },
    dropdown: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        borderColor: colors.greenCustom,
        borderWidth: 1,
        zIndex: 1000,
    },
    dropDownContainer: {
        width: '90%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
    },
    signatureContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.greenCustom,
        borderRadius: 10,
        borderStyle: 'dashed',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    placeholderText: {
        color: colors.gray,
        marginTop: 5,
        textAlign: 'center',
    },
    imageLabel: {
        marginTop: 8,
        fontSize: 14,
        color: colors.black,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    }
})