const readingRepository = require('../repositories/readingRepository');

const VALID_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

class ReadingService {
  validateFutureDate(dateStr) {
    if (!dateStr) {
      throw new Error('Date is required.');
    }
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (dateStr > todayStr) {
      throw new Error('Date cannot be in the future.');
    }
  }

  validateGlucoseValue(value) {
    if (value === undefined || value === null || value === '') {
      throw new Error('Please enter a glucose value.');
    }

    const num = Number(value);
    if (!Number.isInteger(num) || num < 40 || num > 600) {
      throw new Error('Value must be between 40 and 600 mg/dl.');
    }
    return num;
  }

  validateSlot(slot) {
    if (!slot || !VALID_SLOTS.includes(slot)) {
      throw new Error(`Invalid slot. Must be one of: ${VALID_SLOTS.join(', ')}`);
    }
  }

  async getDailyReadings(userId, date) {
    this.validateFutureDate(date);
    return await readingRepository.findByUserAndDate(userId, date);
  }

  async createReading(userId, { date, slot, value }) {
    this.validateFutureDate(date);
    this.validateSlot(slot);
    const validatedValue = this.validateGlucoseValue(value);


    const dayCount = await readingRepository.countByDate(userId, date);
    if (dayCount >= 4) {
      throw new Error('You can add only 4 readings per day.');
    }

    const existingSlot = await readingRepository.findByUserDateAndSlot(userId, date, slot);
    if (existingSlot) {
      throw new Error(`You already have an ${slot} reading for this date.`);
    }

    return await readingRepository.create({
      userId,
      date,
      slot,
      value: validatedValue,
    });
  }

  async updateReading(id, userId, { date, slot, value }) {
    const existingReading = await readingRepository.findById(id, userId);
    if (!existingReading) {
      throw new Error('Reading not found.');
    }

    this.validateFutureDate(date);
    this.validateSlot(slot);
    const validatedValue = this.validateGlucoseValue(value);

    if (existingReading.date !== date || existingReading.slot !== slot) {
      const slotConflict = await readingRepository.findByUserDateAndSlot(userId, date, slot);
      if (slotConflict && slotConflict.id !== parseInt(id, 10)) {
        throw new Error(`You already have an ${slot} reading for this date.`);
      }

      if (existingReading.date !== date) {
        const dayCount = await readingRepository.countByDate(userId, date);
        if (dayCount >= 4) {
          throw new Error('You can add only 4 readings per day.');
        }
      }
    }
    return await readingRepository.update(id, userId, {
      date,
      slot,
      value: validatedValue,
    });
  }

  async deleteReading(id, userId) {
    const deleted = await readingRepository.delete(id, userId);
    if (!deleted) {
      throw new Error('Reading not found.');
    }
    return { success: true, message: 'Reading deleted successfully.' };
  }
}

module.exports = new ReadingService();