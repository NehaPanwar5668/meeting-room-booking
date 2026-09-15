def check_conflict(bookings, start, end):
    for booking in bookings:
        if start < booking.end_time and end > booking.start_time:
            return booking
    return None


def validate_time(start, end):
    if end <= start:
        return "End time must be after start time."

    if start.hour < 9 or end.hour > 18:
        return "Booking time must be between 09:00 and 18:00."

    return None


def find_next_available(bookings, duration):
    current = 9 * 60

    for booking in bookings:
        start = booking.start_time.hour * 60 + booking.start_time.minute
        end = booking.end_time.hour * 60 + booking.end_time.minute

        if current + duration <= start:
            return current

        current = end

    if current + duration <= 18 * 60:
        return current

    return None