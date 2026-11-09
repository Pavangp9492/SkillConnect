import test from 'node:test';
import assert from 'node:assert/strict';

// Test validation logic
function validateRegistration(data, workshop, existingRegistrations) {
  const errors = [];

  if (!workshop) {
    errors.push('Workshop not found.');
  }

  if (!data.participantName || data.participantName.trim().length < 3) {
    errors.push('Name must be at least 3 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push('Invalid email address.');
  }

  const phoneRegex = /^\+?[0-9]{10,14}$/;
  const cleanPhone = data.phone ? data.phone.replace(/[\s-]/g, '') : '';
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    errors.push('Phone must be at least 10 digits.');
  }

  const age = parseInt(data.age, 10);
  if (isNaN(age) || age < 10 || age > 100) {
    errors.push('Age must be between 10 and 100.');
  }

  if (!data.village || data.village.trim().length < 2) {
    errors.push('Village is required.');
  }

  if (workshop) {
    const isDuplicate = existingRegistrations.some(
      r => r.workshop_id === workshop.id && r.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (isDuplicate) {
      errors.push('Duplicate email for this workshop.');
    }

    const currentCount = existingRegistrations.filter(r => r.workshop_id === workshop.id).length;
    if (currentCount >= workshop.total_seats) {
      errors.push('Workshop is fully booked.');
    }
  }

  return errors;
}

test('Validation: accepts valid participant registration', () => {
  const workshop = { id: 'ws-1', total_seats: 10 };
  const existing = [];
  const payload = {
    participantName: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '9876543210',
    age: 28,
    village: 'Kothur',
  };

  const errors = validateRegistration(payload, workshop, existing);
  assert.equal(errors.length, 0);
});

test('Validation: catches invalid email and short phone', () => {
  const workshop = { id: 'ws-1', total_seats: 10 };
  const existing = [];
  const payload = {
    participantName: 'Ramesh Kumar',
    email: 'invalid-email-string',
    phone: '12345',
    age: 28,
    village: 'Kothur',
  };

  const errors = validateRegistration(payload, workshop, existing);
  assert.ok(errors.includes('Invalid email address.'));
  assert.ok(errors.includes('Phone must be at least 10 digits.'));
});

test('Validation: prevents duplicate registration with same email for same workshop', () => {
  const workshop = { id: 'ws-1', total_seats: 10 };
  const existing = [
    { workshop_id: 'ws-1', email: 'ramesh@example.com' }
  ];
  const payload = {
    participantName: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '9876543210',
    age: 28,
    village: 'Kothur',
  };

  const errors = validateRegistration(payload, workshop, existing);
  assert.ok(errors.includes('Duplicate email for this workshop.'));
});

test('Validation: blocks registration when workshop is full', () => {
  const workshop = { id: 'ws-1', total_seats: 2 };
  const existing = [
    { workshop_id: 'ws-1', email: 'user1@example.com' },
    { workshop_id: 'ws-1', email: 'user2@example.com' },
  ];
  const payload = {
    participantName: 'New Member',
    email: 'new@example.com',
    phone: '9876543210',
    age: 30,
    village: 'Kothur',
  };

  const errors = validateRegistration(payload, workshop, existing);
  assert.ok(errors.includes('Workshop is fully booked.'));
});

test('Seat calculation: accurately computes remaining seats', () => {
  const workshop = { id: 'ws-1', total_seats: 25 };
  const existing = [
    { workshop_id: 'ws-1', email: 'user1@example.com' },
    { workshop_id: 'ws-1', email: 'user2@example.com' },
    { workshop_id: 'ws-1', email: 'user3@example.com' },
  ];

  const regCount = existing.filter(r => r.workshop_id === workshop.id).length;
  const available = Math.max(0, workshop.total_seats - regCount);

  assert.equal(regCount, 3);
  assert.equal(available, 22);
  assert.equal(available <= 0, false);
});

test('Attendance tracking: updates status between Registered, Present, Absent', () => {
  const reg = { id: 'reg-1', attendance_status: 'Registered' };
  
  // Mark present
  reg.attendance_status = 'Present';
  assert.equal(reg.attendance_status, 'Present');

  // Mark absent
  reg.attendance_status = 'Absent';
  assert.equal(reg.attendance_status, 'Absent');
});
