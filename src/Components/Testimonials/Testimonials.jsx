// src/components/Testimonials.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Zubair Ahmed",
    role: "Citizen",
    feedback:
      "CityWatch helped me report a broken streetlight, and it was fixed within 2 days!",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Abuzar Giffari",
    role: "Citizen",
    feedback:
      "I love how easy it is to track the progress of my reported issues in real-time.",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Ali Khan",
    role: "Staff",
    feedback:
      "Assigning and resolving issues is so much easier now with CityWatch!",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Sara Rahman",
    role: "Citizen",
    feedback:
      "Boosting issue priority for urgent matters is very convenient and efficient.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Murshida Rahman",
    role: "Citizen",
    feedback:
      "The platform is user-friendly and makes reporting issues fast and easy.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Rehana Begum",
    role: "Citizen",
    feedback:
      "CityWatch helped me stay informed about the status of local infrastructure problems.",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Abdur Rahman Molla",
    role: "Staff",
    feedback:
      "Tracking and updating assigned tasks has never been easier. Great system!",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Fatima Noor",
    role: "Citizen",
    feedback:
      "I reported a pothole near my street, and it got fixed in a week. Amazing service!",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Rashed Khan",
    role: "Citizen",
    feedback:
      "The dashboard is very intuitive. I can see all my reported issues and their statuses.",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Laila Ahmed",
    role: "Citizen",
    feedback:
      "Boosting priority for urgent issues is extremely helpful during emergencies.",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    name: "Omar Faruk",
    role: "Staff",
    feedback:
      "Assigning issues to staff and updating progress is streamlined with CityWatch.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Nadim Haque",
    role: "Citizen",
    feedback:
      "I love the transparency. I can see exactly how my issues are being handled.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Rehan Siddique",
    role: "Citizen",
    feedback:
      "The subscription feature for premium users is very convenient for frequent reporters.",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    name: "Hira Rayhan",
    role: "Citizen",
    feedback:
      "CityWatch encourages citizen engagement and improves our city services.",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    name: "Mustafa Ali",
    role: "Staff",
    feedback:
      "I can manage all assigned issues efficiently. The timeline feature is extremely useful.",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];


const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-12">
          What Our Users Say
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center mx-2 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-16 h-16 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
                <FaQuoteLeft className="text-blue-600 mb-4 text-2xl" />
                <p className="text-gray-600 mb-4">{testimonial.feedback}</p>
                <h3 className="text-lg font-bold text-gray-900">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
