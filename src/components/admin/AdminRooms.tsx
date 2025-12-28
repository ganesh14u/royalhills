import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IndianRupee, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  amenities: string[];
  rent_amount: number;
  monthly_rent: number;
  capacity: number;
  is_available: boolean;
  occupants?: number;
  vacancies?: number;
}

interface AdminRoomsProps {
  rooms: Room[];
  onAddRoom: (roomData: Omit<Room, "id">) => Promise<void>;
  onUpdateRoom: (roomId: string, updates: Partial<Room>) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
}

const AdminRooms = ({
  rooms,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
}: AdminRoomsProps) => {
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [addRoomForm, setAddRoomForm] = useState({
    room_number: "",
    room_type: "single" as Room["room_type"],
    monthly_rent: "",
    capacity: "",
  });

  const [editRoomForm, setEditRoomForm] = useState({
    room_number: "",
    room_type: "single" as Room["room_type"],
    monthly_rent: "",
    capacity: "",
  });

  const handleAddRoom = async () => {
    const monthlyRent = Number(addRoomForm.monthly_rent);
    await onAddRoom({
      room_number: addRoomForm.room_number,
      room_type: addRoomForm.room_type,
      rent_amount: monthlyRent,
      monthly_rent: monthlyRent,
      capacity: Number(addRoomForm.capacity),
      is_available: true,
      amenities: [],
    });

    toast({ title: "Room added successfully" });

    setAddRoomForm({
      room_number: "",
      room_type: "single",
      monthly_rent: "",
      capacity: "",
    });

    setIsAddRoomOpen(false);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    await onUpdateRoom(editingRoom.id, {
      room_number: editRoomForm.room_number,
      room_type: editRoomForm.room_type,
      monthly_rent: Number(editRoomForm.monthly_rent),
      capacity: Number(editRoomForm.capacity),
    });

    toast({ title: "Room updated successfully" });

    setIsEditRoomOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = async (roomId: string) => {
    await onDeleteRoom(roomId);
    toast({ title: "Room deleted" });
  };

  const groupedRooms = {
    single: rooms.filter((r) => r.room_type === "single"),
    double: rooms.filter((r) => r.room_type === "double"),
    triple: rooms.filter((r) => r.room_type === "triple"),
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Rooms</h1>
          <p className="text-muted-foreground">View and manage all rooms</p>
        </div>

        <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Room Number</Label>
                <Input
                  value={addRoomForm.room_number}
                  onChange={(e) =>
                    setAddRoomForm({
                      ...addRoomForm,
                      room_number: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Room Type</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={addRoomForm.room_type}
                  onChange={(e) =>
                    setAddRoomForm({
                      ...addRoomForm,
                      room_type: e.target.value as Room["room_type"],
                    })
                  }
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </div>

              <div>
                <Label>Monthly Rent</Label>
                <Input
                  type="number"
                  value={addRoomForm.monthly_rent}
                  onChange={(e) =>
                    setAddRoomForm({
                      ...addRoomForm,
                      monthly_rent: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={addRoomForm.capacity}
                  onChange={(e) =>
                    setAddRoomForm({
                      ...addRoomForm,
                      capacity: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleAddRoom}>Add Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ROOMS */}
      {Object.entries(groupedRooms).map(([type, list]) =>
        list.length ? (
          <div key={type} className="space-y-4">
            <h2 className="text-xl font-bold capitalize">{type} Sharing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((room) => {
                const occupants = room.occupants ?? 0;
                const vacancies = room.capacity - occupants;

                return (
                  <Card key={room.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>Room {room.room_number}</CardTitle>
                        <Badge
                          className={
                            vacancies > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {vacancies > 0
                            ? `Available (${vacancies})`
                            : "Fully Occupied"}
                        </Badge>
                      </div>
                      <CardDescription className="capitalize">
                        {room.room_type} Sharing
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly Rent</span>
                        <span className="flex items-center font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          {room.monthly_rent}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Dialog
                          open={isEditRoomOpen && editingRoom?.id === room.id}
                          onOpenChange={(open) => {
                            setIsEditRoomOpen(open);
                            if (!open) setEditingRoom(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRoom(room);
                                setEditRoomForm({
                                  room_number: room.room_number,
                                  room_type: room.room_type,
                                  monthly_rent: String(room.monthly_rent),
                                  capacity: String(room.capacity),
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

                            <div className="space-y-3">
                              <Input
                                value={editRoomForm.room_number}
                                onChange={(e) =>
                                  setEditRoomForm({
                                    ...editRoomForm,
                                    room_number: e.target.value,
                                  })
                                }
                              />

                              <Input
                                type="number"
                                value={editRoomForm.monthly_rent}
                                onChange={(e) =>
                                  setEditRoomForm({
                                    ...editRoomForm,
                                    monthly_rent: e.target.value,
                                  })
                                }
                              />

                              <Input
                                type="number"
                                value={editRoomForm.capacity}
                                onChange={(e) =>
                                  setEditRoomForm({
                                    ...editRoomForm,
                                    capacity: e.target.value,
                                  })
                                }
                              />

                              <Button onClick={handleUpdateRoom}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={occupants > 0}
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default AdminRooms;
