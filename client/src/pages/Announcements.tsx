import { useState } from 'react';
import AnnouncementsTable from '@/components/announcements/AnnouncementsTable';
import ClassSchedule from '@/components/announcements/ClassSchedule';
import AnnouncementModal from '@/components/announcements/AnnouncementModal';
import ScheduleModal from '@/components/announcements/ScheduleModal';
import type { Announcement } from '@shared/schema';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | undefined>(undefined);

  const handleAddAnnouncement = () => {
    setAnnouncementToEdit(undefined);
    setIsAnnouncementModalOpen(true);
  };

  const handleAddSchedule = () => {
    setIsScheduleModalOpen(true);
  };
  
  const handleDeleteAllAnnouncements = async () => {
    if (confirm('Are you sure you want to delete all announcements? This action cannot be undone.')) {
      try {
        await fetch('/api/announcements/all', {
          method: 'DELETE',
        });
        // Refresh the page to show the changes
        window.location.reload();
      } catch (error) {
        console.error('Error deleting announcements:', error);
      }
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement);
    setIsAnnouncementModalOpen(true);
  };

  const handleSaveSchedule = (data: any) => {
    // Add schedule item to the grid via the global function
    if ((window as any).addScheduleItem) {
      (window as any).addScheduleItem({
        day: data.day,
        time: data.time,
        course: data.course,
        room: data.room,
        color: data.color
      });
      
      // Show success message
      toast({
        title: "Schedule Added",
        description: "The class has been added to the schedule.",
      });
    } else {
      // Fallback if the function isn't available
      console.log('Schedule data:', data);
      toast({
        title: "Schedule Not Saved",
        description: "There was an issue adding the class to the schedule.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Announcements</h2>
          <div className="flex space-x-3">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-medium flex items-center shadow-md transition-all hover:shadow-lg"
              onClick={handleAddAnnouncement}
            >
              <i className="fas fa-plus mr-2"></i> Add New
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium flex items-center shadow-md transition-all hover:shadow-lg"
              onClick={handleDeleteAllAnnouncements}
            >
              <i className="fas fa-trash mr-2"></i> Delete All
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>

        <AnnouncementsTable onEditAnnouncement={handleEditAnnouncement} searchTerm={searchTerm} />
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Class Schedule</h2>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-medium flex items-center shadow-md transition-all hover:shadow-lg"
            onClick={handleAddSchedule}
          >
            <i className="fas fa-plus mr-2"></i> Add Class
          </button>
        </div>
        <ClassSchedule />
      </section>

      <AnnouncementModal 
        isOpen={isAnnouncementModalOpen} 
        onClose={() => setIsAnnouncementModalOpen(false)} 
        announcementToEdit={announcementToEdit}
      />

      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        onSave={handleSaveSchedule}
      />
    </div>
  );
};

export default Announcements;
