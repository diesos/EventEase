import { createEvent, editEvent as eventEdition, fetchEvents } from '@/features/events/services';
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import uuid from "react-native-uuid";
import type { Event } from '../../../types';

type CreateEventModalProps = {
  visible: boolean;
  onClose: () => void;
  editEvent?: Event; // Pour le mode édition
  isSaving?: boolean;
  onStartSaving?: () => void;
  onFinishSaving?: () => void;
};

const CreateEventModal = ({ visible, onClose, editEvent, isSaving, onStartSaving, onFinishSaving }: CreateEventModalProps) => {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [description, setDescription] = useState(editEvent?.description || '');
  const [dateEvent, setDateEvent] = useState<Event["date"]>(editEvent?.date || new Date());
  const [location, setLocation] = useState(editEvent?.date || '');
  const [idEvent, setEventId] = useState<Event["id"]>();

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }

    onStartSaving?.();

    try {
      const existingEvents = await fetchEvents();

      const newEvent: Event = {
        id: uuid.v4(),
        title: title.trim(),
        description: description,
        date: dateEvent ? dateEvent : new Date(),
        location: location.toString(),
        isActive: true,
        imageUrl: ''
      };

      if (editEvent) {
        // Mode édition
        const updatedEvent = {
          ...editEvent,
          id : editEvent.id ? editEvent.id : uuid.v4(),
          title: title ? title.trim() : editEvent.title,
          description: description ? description : editEvent.title,
          date: dateEvent ? dateEvent : editEvent.date,
          location: location ? location : editEvent.location
        };

        await eventEdition(updatedEvent);
        Alert.alert('Succès', 'Event modifié avec succès');
      } else {
        // Mode création
        await createEvent(newEvent);
        Alert.alert('Succès', 'Marker créé avec succès');
      }

      setTitle('');
      setDescription('');
      setLocation('');
      setDateEvent('')
      onFinishSaving?.();
      onClose();
    } catch (error) {
      onFinishSaving?.();
      Alert.alert('Erreur', 'Impossible de sauvegarder l event');
      console.error('Error saving event:', error);
    }
  };

  const handleCancel = () => {
      setTitle('');
      setDescription('');
      setLocation('');
      setDateEvent('')
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
          <Text style={styles.title}>
            {editEvent ? 'Éditer le l event' : 'Créer un evenement'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Titre de l event"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Description de l'event"
            />
          </View>

          <View style={styles.inputContainer}>
                <Text style={styles.label}> Date de l'évenement</Text>
                <DateTimePicker
                  value={dateEvent}
                  onChange={(event, date) => date && setDateEvent(date)}
                  minimumDate={new Date()}
                  timeZoneOffsetInSeconds={3600}
                  mode="datetime"
                />
          </View>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.savingButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <View style={styles.savingContainer}>
                  <ActivityIndicator size="small" color="white" style={styles.savingIndicator} />
                  <Text style={styles.saveButtonText}>Sauvegarde...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              )}
            </TouchableOpacity>
          </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 350,
    maxHeight: '65%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  imageButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  coordinatesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  savingButton: {
    backgroundColor: '#9BB5E8',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingIndicator: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default CreateMarkerModal;
