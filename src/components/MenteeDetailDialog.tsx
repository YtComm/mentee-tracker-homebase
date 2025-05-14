
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AttendanceRecord, 
  CheckInNote, 
  googleSheetsService 
} from '@/services/googleSheetsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface MenteeDetailDialogProps {
  mentee: AttendanceRecord;
  isOpen: boolean;
  onClose: () => void;
}

const MenteeDetailDialog: React.FC<MenteeDetailDialogProps> = ({ mentee, isOpen, onClose }) => {
  const [notes, setNotes] = useState<CheckInNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && mentee) {
      loadMenteeNotes();
    }
  }, [isOpen, mentee]);

  const loadMenteeNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await googleSheetsService.getMenteeNotes(mentee.id);
      // Sort notes by timestamp, most recent first
      fetchedNotes.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotes(fetchedNotes);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load notes',
        description: 'There was an error loading this mentee\'s notes.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;
    
    try {
      setIsSaving(true);
      const timestamp = new Date().toISOString();
      
      const newCheckInNote = await googleSheetsService.addCheckInNote({
        menteeId: mentee.id,
        timestamp,
        note: newNote.trim(),
        executiveName: user.name,
      });
      
      setNotes([newCheckInNote, ...notes]); // Add to the beginning
      setNewNote(''); // Clear input
      
      toast({
        title: 'Note added',
        description: 'Your note has been successfully added.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add note',
        description: 'There was an error adding your note. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingNote = (note: CheckInNote) => {
    setEditingNoteId(note.id);
    setEditedNoteContent(note.note);
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditedNoteContent('');
  };

  const saveEditedNote = async (noteId: string) => {
    if (!editedNoteContent.trim()) return;
    
    try {
      setIsSaving(true);
      const noteToUpdate = notes.find(note => note.id === noteId);
      
      if (!noteToUpdate) return;
      
      const updatedNote = await googleSheetsService.updateCheckInNote({
        ...noteToUpdate,
        note: editedNoteContent.trim()
      });
      
      // Update the note in the local state
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      
      // Clear editing state
      setEditingNoteId(null);
      setEditedNoteContent('');
      
      toast({
        title: 'Note updated',
        description: 'Your note has been successfully updated.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update note',
        description: 'There was an error updating your note. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityLabel = (priority: string | null) => {
    switch (priority) {
      case 'P0': return 'P0 (Missed 4 classes)';
      case 'P1': return 'P1 (Missed 3 classes)';
      case 'P2': return 'P2 (Missed 2 classes)';
      case 'P3': return 'P3 (Missed 1 class)';
      default: return 'No Priority';
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800 border-red-200';
      case 'P1': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Support Needed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Call Later': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'DNR': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">{mentee.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="ml-2">{mentee.email}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span className="ml-2">{mentee.phone}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Attendance Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Priority:</span>
                <Badge className={`ml-2 ${getPriorityColor(mentee.priority)}`}>
                  {getPriorityLabel(mentee.priority)}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={`ml-2 ${getStatusColor(mentee.status)}`}>
                  {mentee.status}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Last Attendance:</span>
                <span className="ml-2">
                  {mentee.lastAttendance ? 
                    new Date(mentee.lastAttendance).toLocaleDateString() : 
                    'Never'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Missed Classes:</span>
                <span className="ml-2">{mentee.missedClasses}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <h3 className="text-lg font-medium mb-4">Check-in Notes</h3>
          
          {/* Add new note */}
          <div className="mb-6">
            <Textarea 
              placeholder="Add a new check-in note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="mb-2"
            />
            <Button onClick={handleAddNote} disabled={!newNote.trim() || isSaving}>
              {isSaving ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
          
          {/* Notes list */}
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No check-in notes yet
              </div>
            ) : (
              notes.map((note) => (
                <div 
                  key={note.id} 
                  className="bg-muted/30 p-4 rounded-md border"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium">
                      {note.executiveName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(note.timestamp), 'dd MMM yyyy, h:mm a')}
                    </div>
                  </div>
                  
                  {editingNoteId === note.id ? (
                    <div className="mt-2">
                      <Textarea 
                        value={editedNoteContent}
                        onChange={(e) => setEditedNoteContent(e.target.value)}
                        rows={3}
                        className="mb-2"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => saveEditedNote(note.id)}
                          disabled={!editedNoteContent.trim() || isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEditingNote}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-2 whitespace-pre-wrap">{note.note}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-xs" 
                        onClick={() => startEditingNote(note)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenteeDetailDialog;
