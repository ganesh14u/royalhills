import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IndianRupee, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  monthly_rent: number;
  capacity: number;
  is_available: boolean;
  amenities: string[];
  occupants?: number;
  vacancies?: number;
}

interface AdminRoomsProps {
  rooms: Room[];
  onAddRoom: (roomData: Omit<Room, 'id'>) => Promise<void>;
  onUpdateRoom: (roomId: string, updates: Partial<Room>) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
}

const AdminRooms = ({ rooms, onAddRoom, onUpdateRoom, onDeleteRoom }: AdminRoomsProps) => {
   const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
   const [editingRoom, setEditingRoom] = useState<Room | null>(null);
   const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);

   // Form states
   const [addRoomForm, setAddRoomForm] = useState({
     room_number: '',
     room_type: 'single' as 'single' | 'double' | 'triple',
     monthly_rent: '',
     capacity: '',
     amenities: ''
   });

   const [editRoomForm, setEditRoomForm] = useState({
     room_number: '',
     room_type: 'single' as 'single' | 'double' | 'triple',
     monthly_rent: '',
     capacity: '',
     amenities: ''
   });

  const handleAddRoom = async () => {
    const capacity = Number(addRoomForm.capacity);
    const roomData = {
      room_number: addRoomForm.room_number,
      room_type: addRoomForm.room_type,
      monthly_rent: Number(addRoomForm.monthly_rent),
      capacity,
      is_available: true,
      amenities: addRoomForm.amenities.split(',').map(a => a.trim()),
    };
    await onAddRoom(roomData);
    setAddRoomForm({
      room_number: '',
      room_type: 'single',
      monthly_rent: '',
      capacity: '',
      amenities: ''
    });
    setIsAddRoomOpen(false);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    const updates = {
      room_number: editRoomForm.room_number,
      room_type: editRoomForm.room_type,
      monthly_rent: Number(editRoomForm.monthly_rent),
      capacity: Number(editRoomForm.capacity),
      amenities: editRoomForm.amenities.split(',').map(a => a.trim()),
    };
    await onUpdateRoom(editingRoom.id, updates);
    setIsEditRoomOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = async (roomId: string) => {
    await onDeleteRoom(roomId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Manage Rooms
          </h1>
          <p className="text-muted-foreground font-body">
            View and manage all rooms
          </p>
        </div>
        <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  placeholder="e.g. 101"
                  value={addRoomForm.room_number}
                  onChange={(e) => setAddRoomForm({...addRoomForm, room_number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_type">Room Type</Label>
                <select
                  id="room_type"
                  className="w-full p-2 border rounded"
                  value={addRoomForm.room_type}
                  onChange={(e) => setAddRoomForm({...addRoomForm, room_type: e.target.value as 'single' | 'double' | 'triple'})}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_rent">Monthly Rent</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  placeholder="5000"
                  value={addRoomForm.monthly_rent}
                  onChange={(e) => setAddRoomForm({...addRoomForm, monthly_rent: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="1"
                  value={addRoomForm.capacity}
                  onChange={(e) => setAddRoomForm({...addRoomForm, capacity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input
                  id="amenities"
                  placeholder="AC, WiFi, Attached Bathroom"
                  value={addRoomForm.amenities}
                  onChange={(e) => setAddRoomForm({...addRoomForm, amenities: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddRoom}>
                  Add Room
                </Button>
                <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg">
                  Room {room.room_number}
                </CardTitle>
                <Badge
                  variant={
                    room.vacancies === room.capacity ? 'secondary' :
                    room.vacancies === 0 ? 'destructive' :
                    'default'
                  }
                  className={
                    room.vacancies === room.capacity ? 'bg-green-500/10 text-green-600' :
                    room.vacancies === 0 ? '' :
                    'bg-yellow-500/10 text-yellow-600'
                  }
                >
                  {room.vacancies === room.capacity ? 'Available' :
                   room.vacancies === 0 ? 'Fully Occupied' :
                   `${room.vacancies} vacancy${room.vacancies > 1 ? 'ies' : ''} left`}
                </Badge>
              </div>
              <CardDescription className="capitalize">
                {room.room_type} Sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Monthly Rent</span>
                <span className="font-body font-semibold flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {room.monthly_rent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Capacity</span>
                <span className="font-body">{room.capacity} person(s)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {room.amenities?.map((amenity, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Dialog open={isEditRoomOpen && editingRoom?.id === room.id} onOpenChange={(open) => {
                  setIsEditRoomOpen(open);
                  if (!open) setEditingRoom(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingRoom(room);
                        setEditRoomForm({
                          room_number: room.room_number,
                          room_type: room.room_type as 'single' | 'double' | 'triple',
                          monthly_rent: room.monthly_rent.toString(),
                          capacity: room.capacity.toString(),
                          amenities: room.amenities?.join(', ') || ''
                        });
                        setIsEditRoomOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Room</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit_room_number">Room Number</Label>
                        <Input
                          id="edit_room_number"
                          value={editRoomForm.room_number}
                          onChange={(e) => setEditRoomForm({...editRoomForm, room_number: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_room_type">Room Type</Label>
                        <select
                          id="edit_room_type"
                          className="w-full p-2 border rounded"
                          value={editRoomForm.room_type}
                          onChange={(e) => setEditRoomForm({...editRoomForm, room_type: e.target.value as 'single' | 'double' | 'triple'})}
                        >
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_monthly_rent">Monthly Rent</Label>
                        <Input
                          id="edit_monthly_rent"
                          type="number"
                          value={editRoomForm.monthly_rent}
                          onChange={(e) => setEditRoomForm({...editRoomForm, monthly_rent: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_capacity">Capacity</Label>
                        <Input
                          id="edit_capacity"
                          type="number"
                          value={editRoomForm.capacity}
                          onChange={(e) => setEditRoomForm({...editRoomForm, capacity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_amenities">Amenities (comma separated)</Label>
                        <Input
                          id="edit_amenities"
                          value={editRoomForm.amenities}
                          onChange={(e) => setEditRoomForm({...editRoomForm, amenities: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateRoom}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditRoomOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRooms;