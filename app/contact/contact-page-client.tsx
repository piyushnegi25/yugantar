"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const defaultState: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactPageClient({ supportEmail }: { supportEmail: string }) {
  const [form, setForm] = useState<ContactFormState>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitMessage("Thanks! Your message has been sent successfully.");
      setForm(defaultState);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <MessageCircle className="h-7 w-7 text-blue-600" />
                Send us a message
              </CardTitle>
              <p className="text-gray-600">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <Input id="firstName" name="firstName" required className="w-full" value={form.firstName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <Input id="lastName" name="lastName" required className="w-full" value={form.lastName} onChange={handleInputChange} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <Input id="email" name="email" type="email" required className="w-full" value={form.email} onChange={handleInputChange} />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" type="tel" className="w-full" value={form.phone} onChange={handleInputChange} />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
                  >
                    <option value="">Select a subject</option>
                    <option value="order-inquiry">Order Inquiry</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return-exchange">Return/Exchange</option>
                    <option value="product-question">Product Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full"
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={handleInputChange}
                  />
                </div>

                {submitMessage ? <p className="text-sm text-green-600">{submitMessage}</p> : null}
                {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:text-blue-700">
                    {supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+918810259676" className="text-green-600 hover:text-green-700">
                    +91 8810259676
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600">
                    H 34 Sector 12
                    <br />
                    Noida
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-violet-600" />
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-gray-600">
                    Monday - Sunday
                    <br />
                    9:00 AM - 9:00 PM IST
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/yugantar.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 p-3 text-white transition-opacity hover:opacity-90"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Stay updated with our latest designs and offers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/faq" className="block text-blue-600 transition-colors hover:text-blue-700">
                Frequently Asked Questions
              </Link>
              <Link href="/faq" className="block text-blue-600 transition-colors hover:text-blue-700">
                Shipping and Delivery FAQs
              </Link>
              <Link href="/faq" className="block text-blue-600 transition-colors hover:text-blue-700">
                Returns and Exchanges FAQs
              </Link>
              <Link href="/collections" className="block text-blue-600 transition-colors hover:text-blue-700">
                Shop Collections
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
