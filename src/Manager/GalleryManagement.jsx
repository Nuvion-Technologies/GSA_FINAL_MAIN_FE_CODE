import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, Plus, X, Check, Loader2 } from "lucide-react";
import axios from "axios";

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const userId = localStorage.getItem('userid') || '1';
    const ip = import.meta.env.VITE_IP;

    const handleToggleStatus = async (imgId, currentStatus) => {
        try {
            console.log(currentStatus);
            setUpdatingId(imgId);
            const response = await axios.post(`${ip}/api/gallery/status-image`, {
                imgid: imgId,
                userid: userId,
                status1: !currentStatus // Send the new status (opposite of current)
            });

            console.log(response);

            // Only update if the API call was successful
            if (response.status === 200) {
                fetchImages(); // Refresh the images list
            } else {
                setError("Failed to update image status.");
            }
        } catch (err) {
            setError("Failed to update image status.");
            console.error("Error updating status:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const fetchImages = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${ip}/api/gallery/images`, {
                userid: userId
            });
            setImages(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to load images. Please try again later.");
            console.error("Error fetching images:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);


    const [newImage, setNewImage] = useState({
        title: "",
        description: "",
        photo: null
    });


    const handleAddImage = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('title', newImage.title);
            formData.append('description', newImage.description);
            if (newImage.photo) {
                formData.append('photo', newImage.photo);
            }

            await axios.post(`${ip}/api/gallery/add-new-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsModalOpen(false);
            setNewImage({ title: "", description: "", photo: null });
            fetchImages();
        } catch (err) {
            setError("Failed to add image. Please try again.");
            console.error("Error adding image:", err);
        }
    };

    const handleDeleteImage = async (imgId) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                await axios.post(`${ip}/api/gallery/delete-image`, {
                    imgid: imgId,
                    userid: userId
                });
                fetchImages();
            } catch (err) {
                setError("Failed to delete image.");
                console.error("Error deleting image:", err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-0 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    {/*<h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>*/}
                    <p className="text-gray-600 mt-1">Manage and organize your gallery content</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add New Image
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                    <div
                        key={image._id}
                        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            {/*<div className="absolute inset-0 flex items-center justify-center">*/}
                            {/*    <ImageIcon className="w-12 h-12 text-gray-400" />*/}
                            {/*</div>*/}
                            {/* If you have image URLs, uncomment and modify this */}
                            <img
                                src={`${ip}/uploads/${image.data}`}
                                alt={image.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{image.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(image._id, image.active)}
                                        disabled={updatingId === image._id}
                                        className={`
          relative px-3 py-1 rounded-full text-sm font-medium
          transition-all duration-300 ease-in-out
          ${image.active
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className={`
            w-2 h-2 rounded-full
            ${image.active ? 'bg-green-500' : 'bg-red-500'}
            ${updatingId === image._id ? 'animate-pulse' : ''}
          `} />
                                            {updatingId == image._id ? 'Updating...' : (image.active ? 'active' : 'inactive')}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImage(image._id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add New Image</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddImage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Photo
                                </label>
                                {/* <div
                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                    <div className="space-y-2 text-center">
                                        {newImage.photo ? (
                                            <div className="relative mx-auto w-32 h-32">
                                                <img
                                                    src={URL.createObjectURL(newImage.photo)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewImage(prev => ({...prev, photo: null}))}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16}/>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="photo-upload"
                                                           className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Upload a photo</span>
                                                        <input
                                                            id="photo-upload"
                                                            name="photo-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const photo = e.target.files?.[0];
                                                                if (photo) {
                                                                    setNewImage(prev => ({
                                                                        ...prev,
                                                                        photo: photo
                                                                    }));
                                                                }
                                                            }}
                                                            required
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div> */}
                                <div
                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                                    onClick={() => document.getElementById("photo-upload")?.click()} // Triggers file input
                                >
                                    <div className="space-y-2 text-center">
                                        {newImage.photo ? (
                                            <div className="relative mx-auto w-32 h-32">
                                                <img
                                                    src={URL.createObjectURL(newImage.photo)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents triggering the main div click
                                                        setNewImage((prev) => ({ ...prev, photo: null }));
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="photo-upload"
                                                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload a photo</span>
                                                        <input
                                                            id="photo-upload"
                                                            name="photo-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const photo = e.target.files?.[0];
                                                                if (photo) {
                                                                    setNewImage((prev) => ({
                                                                        ...prev,
                                                                        photo: photo,
                                                                    }));
                                                                }
                                                            }}
                                                            required
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newImage.title}
                                    onChange={(e) =>
                                        setNewImage({ ...newImage, title: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newImage.description}
                                    onChange={(e) =>
                                        setNewImage({ ...newImage, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Upload size={20} />
                                    Add Image
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first image to the gallery</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default GalleryManagement;
