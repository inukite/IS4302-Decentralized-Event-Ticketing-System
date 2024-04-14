// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoyaltyPoints.sol";

/**
 * @title A priority queue implementation for managing queue elements based on loyalty points.
 **/
contract PriorityQueue {
    struct QueueElement {
        address addr; // Address of the queue participant
        uint256 priority; // Loyalty points determine priority in the queue
        uint256 insertionOrder; // Used to maintain stability among equal priorities
    }

    QueueElement[] private heapArray; // Array representation of the heap
    uint256 public size; // Number of elements in the heap
    address private organizer; // Address of the queue organizer for access control
    LoyaltyPoints loyaltyPointsContract; // Reference to the LoyaltyPoints contract
    uint256 private insertionCounter = 0; // Counter to keep track of insertion order
    address public presaleMarketAddress; // Address of the PresaleMarket, authorized to modify the queue

    event ElementEnqueued(address indexed enqueuedAddress);
    event ElementDequeued(address indexed dequeuedAddress);

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Caller is not the organizer");
        _;
    }

    modifier onlyPresaleMarketOrOrganizer() {
        require(
            msg.sender == organizer || msg.sender == presaleMarketAddress,
            "Unauthorized"
        );
        _;
    }

    /**
     * @notice Initializes the contract with a LoyaltyPoints contract address
     * @param loyaltyPointsAddress The address of the LoyaltyPoints contract
     **/
    constructor(address loyaltyPointsAddress) {
        organizer = msg.sender;
        loyaltyPointsContract = LoyaltyPoints(loyaltyPointsAddress);
        heapArray.push(
            QueueElement({addr: address(0), priority: 0, insertionOrder: 0})
        );
        size = 0;
    }

    /**
     * @notice Sets the address of the PresaleMarket contract
     * @param _presaleMarketAddress The address to be set
     **/
    function setPresaleMarketAddress(
        address _presaleMarketAddress
    ) external onlyOrganizer {
        presaleMarketAddress = _presaleMarketAddress;
    }

    /**
     * @notice Sets the address of the LoyalyPoints contract
     * @param _loyaltyPointsContract The address to be set
     **/
    function setLoyaltyPointsContractAddress(
        address _loyaltyPointsContract
    ) external onlyOrganizer {
        loyaltyPointsContract = LoyaltyPoints(_loyaltyPointsContract);
    }

    /**
     * @notice Enqueues an address with its current loyalty points as priority
     * @param _addr Address to be enqueued
     */
    function enqueue(address _addr) public onlyPresaleMarketOrOrganizer {
        uint256 loyaltyPoints = loyaltyPointsContract.getPoints(_addr);
        heapArray.push(
            QueueElement({
                addr: _addr,
                priority: loyaltyPoints,
                insertionOrder: insertionCounter++
            })
        );
        size++;
        _bubbleUp(size);
        emit ElementEnqueued(_addr);
    }

    /**
     * @notice Dequeues the highest priority address from the queue
     * @return address The address of the dequeued participant
     **/
    function dequeue() public onlyPresaleMarketOrOrganizer returns (address) {
        require(size > 0, "Queue is empty");
        address highestPriorityAddress = heapArray[1].addr;

        heapArray[1] = heapArray[size]; // Move the last element to the top
        heapArray.pop(); // Remove the last element
        size--;
        if (size > 0) {
            _bubbleDown(1); // Re-sort the heap
        }
        emit ElementDequeued(highestPriorityAddress);
        return highestPriorityAddress;
    }

    /**
     * @notice Pops the highest priority buyer from the queue
     * @return address The address of the highest priority buyer
     **/
    function popHighestPriorityBuyer()
        public
        onlyPresaleMarketOrOrganizer
        returns (address)
    {
        require(size > 0, "Queue is empty");
        return dequeue(); // Use dequeue logic to pop and return the highest priority (loyalty points) buyer
    }

    /**
     * @notice Provides the highest priority participant without removing them from the queue
     * @return addr Address of the participant with the highest priority
     * @return priority Loyalty points of the highest priority participant
     **/
    function peekHighestPriority()
        public
        view
        returns (address addr, uint256 priority)
    {
        require(size > 0, "Queue is empty");
        return (heapArray[1].addr, heapArray[1].priority);
    }

    /**
     * @notice Updates the priority of a specific address in the queue
     * @param _addr Address whose priority needs to be updated
     **/
    function updatePriority(address _addr) public onlyOrganizer {
        for (uint256 i = 1; i <= size; i++) {
            if (heapArray[i].addr == _addr) {
                uint256 newLoyaltyPoints = loyaltyPointsContract.getPoints(
                    _addr
                );
                bool shouldBubbleUp = newLoyaltyPoints > heapArray[i].priority;
                heapArray[i].priority = newLoyaltyPoints; // Update priority

                if (shouldBubbleUp) {
                    // If the new priority is higher, it might need to bubble up
                    _bubbleUp(i);
                } else {
                    // Otherwise, check if it needs to bubble down.
                    // This case can be rare if updating to lower priority is allowed
                    _bubbleDown(i);
                }
                break;
            }
        }
    }

    /**
     * @notice Checks if an address is currently in the queue
     * @param _addr Address to check
     * @return bool True if the address is in the queue, false otherwise
     **/
    function isInQueue(address _addr) public view returns (bool) {
        for (uint256 i = 1; i <= size; i++) {
            if (heapArray[i].addr == _addr) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Checks if the queue is empty
     * @return bool True if the queue is empty, false otherwise
     **/
    function isEmpty() public view returns (bool) {
        return size == 0;
    }

    // Private helper functions for managing the heap
    function _bubbleUp(uint256 index) private {
        while (index > 1) {
            uint256 parentIndex = index / 2;
            bool shouldSwap = heapArray[index].priority >
                heapArray[parentIndex].priority ||
                (heapArray[index].priority == heapArray[parentIndex].priority &&
                    heapArray[index].insertionOrder <
                    heapArray[parentIndex].insertionOrder);

            if (shouldSwap) {
                // Use a temporary variable to perform the swap
                QueueElement memory temp = heapArray[parentIndex];
                heapArray[parentIndex] = heapArray[index];
                heapArray[index] = temp;

                index = parentIndex;
            } else {
                break;
            }
        }
    }

    function _bubbleDown(uint256 index) private {
        while (index * 2 <= size) {
            uint256 leftChildIndex = 2 * index;
            uint256 rightChildIndex = 2 * index + 1;
            uint256 swapIndex = index;

            if (
                leftChildIndex <= size &&
                (heapArray[leftChildIndex].priority >
                    heapArray[swapIndex].priority ||
                    (heapArray[leftChildIndex].priority ==
                        heapArray[swapIndex].priority &&
                        heapArray[leftChildIndex].insertionOrder <
                        heapArray[swapIndex].insertionOrder))
            ) {
                swapIndex = leftChildIndex;
            }

            if (
                rightChildIndex <= size &&
                (heapArray[rightChildIndex].priority >
                    heapArray[swapIndex].priority ||
                    (heapArray[rightChildIndex].priority ==
                        heapArray[swapIndex].priority &&
                        heapArray[rightChildIndex].insertionOrder <
                        heapArray[swapIndex].insertionOrder))
            ) {
                swapIndex = rightChildIndex;
            }

            if (swapIndex != index) {
                // Use a temporary variable to perform the swap
                QueueElement memory temp = heapArray[index];
                heapArray[index] = heapArray[swapIndex];
                heapArray[swapIndex] = temp;

                index = swapIndex;
            } else {
                break;
            }
        }
    }
}
