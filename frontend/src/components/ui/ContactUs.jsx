import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, AlertCircle, Send, CheckCircle, Users, Bus, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, AlertCircle, Send, CheckCircle, Users, Bus, HelpCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
