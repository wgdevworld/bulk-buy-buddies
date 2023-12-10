import React, { useState, useEffect } from "react";

// Define the interface for an unmatched request
export interface UnmatchedRequest {
  userName: string;
  category: string;
  quantity: number;
  timeStart: string;
  timeEnd: string;
  locationName: string;
}

// Define the prop types for the UnmatchedRequests component
interface UnmatchedRequestsProps {
  locationId: number;
}

// Define the UnmatchedRequests component
function UnmatchedRequests({ locationId }: UnmatchedRequestsProps) {
  // Define state variables
  const [unmatchedRequests, setUnmatchedRequests] = useState<UnmatchedRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // useEffect hook to fetch data when the component mounts or dependencies change
  useEffect(() => {
    const fetchUnmatchedData = async () => {
      try {
        // Fetch unmatched requests data
        const requestsResponse = await fetch(
          `http://127.0.0.1:5000/get_requests_in_location/${locationId}`
        );
        if (!requestsResponse.ok) {
          throw new Error(
            `Failed to fetch requests: ${requestsResponse.status} ${requestsResponse.statusText}`
          );
        }
        const unmatchedRequestsData = await requestsResponse.json();

        // Fetch location name
        const locationResponse = await fetch(
          `http://127.0.0.1:5000/get_location_name/${locationId}`
        );
        if (!locationResponse.ok) {
          throw new Error(
            `Failed to fetch location name: ${locationResponse.status} ${locationResponse.statusText}`
          );
        }
        const locationName = await locationResponse.text();

        // Fetch user names
        const uniqueUserIds = Array.from(
          new Set(unmatchedRequestsData.map((request: { userID: any }) => request.userID))
        );
        const userPromises = uniqueUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `http://127.0.0.1:5000/get_user_name/${userId}`
          );
          if (!userResponse.ok) {
            throw new Error(
              `Failed to fetch user name: ${userResponse.status} ${userResponse.statusText}`
            );
          }
          const userName = await userResponse.text();
          return { userId, userName };
        });
        const userResults = await Promise.all(userPromises);

        // Extract unique categories and set available categories
        const uniqueCategories = Array.from(
          new Set(unmatchedRequestsData.map((request: { category: any }) => request.category))
        );
        setAvailableCategories(uniqueCategories as string[]);

        // Update unmatched requests data with user names and location name
        const updatedRequestsData = unmatchedRequestsData.map(
          (request: { userID: unknown }) => {
            const userResult = userResults.find(
              (userResult) => userResult.userId === request.userID
            );
            return {
              ...request,
              userName: userResult ? userResult.userName : "Unknown User",
              locationName,
            };
          }
        );

        // Filter requests based on selected category
        const filteredRequests =
          selectedCategory === null
            ? updatedRequestsData
            : updatedRequestsData.filter(
                (request: { category: string; }) => request.category === selectedCategory
              );

        setUnmatchedRequests(filteredRequests);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
        setUnmatchedRequests([]);
      }
    };

    fetchUnmatchedData();
  }, [locationId, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === "all" ? null : e.target.value);
  };

  return (
    <div className="w-screen unmatched-requests p-4 flex justify-center items-center">
      <div className="w-90screen">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">
          Unmatched Requests in {unmatchedRequests.length > 0 ? unmatchedRequests[0].locationName : ""}
        </h2>
        <label className="block">Select Category:</label>
        <select
          className="border border-blue-600 rounded-md px-3 py-2 mb-2 text-blue-900"
          onChange={handleCategoryChange}
        >
          <option value="all">All</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-0">
              <tr>
                <th className="px-4 py-2 text-left text-blue-900">User</th>
                <th className="px-4 py-2 text-left text-blue-900">Category</th>
                <th className="px-4 py-2 text-left text-blue-900">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {unmatchedRequests.map((request, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-transparent" : "bg-transparent border-t"}
                >
                  <td className="px-4 py-2">{request.userName}</td>
                  <td className="px-4 py-2">{request.category}</td>
                  <td className="px-4 py-2">{request.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UnmatchedRequests;
