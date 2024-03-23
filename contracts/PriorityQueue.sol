// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoyaltyPoints.sol";

contract PriorityQueue {
    struct QueueElement {
        address addr;
        uint256 priority;
    }

    QueueElement[] private heapArray;
    uint256 public size;
    address private organizer; // Added for access control
    LoyaltyPoints loyaltyPointsContract;

    function setLoyaltyPointsContractAddress(
        address _addr
    ) external onlyOrganizer {
        loyaltyPointsContract = LoyaltyPoints(_addr);
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Caller is not the organizer");
        _;
    }

    constructor(address loyaltyPointsAddress) {
        organizer = msg.sender;
        loyaltyPointsContract = LoyaltyPoints(loyaltyPointsAddress);
        heapArray.push(QueueElement({addr: address(0), priority: 0}));
        size = 0;
    }

    event ElementEnqueued(address indexed enqueuedAddress);
    event ElementDequeued(address indexed dequeuedAddress);

    function enqueue(address _addr) public onlyOrganizer {
        uint256 loyaltyPoints = loyaltyPointsContract.getPoints(_addr);
        heapArray.push(QueueElement({addr: _addr, priority: loyaltyPoints}));
        size++;
        _bubbleUp(size);
        emit ElementEnqueued(_addr);
    }

    function dequeue() public onlyOrganizer returns (address) {
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

    function popHighestPriorityBuyer() public onlyOrganizer returns (address) {
        require(size > 0, "Queue is empty");
        return dequeue(); // Use dequeue logic to pop and return the highest priority (loyalty points) buyer
    }

    function peekHighestPriority()
        public
        view
        returns (address addr, uint256 priority)
    {
        require(size > 0, "Queue is empty");
        return (heapArray[1].addr, heapArray[1].priority);
    }

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

    function isInQueue(address _addr) public view returns (bool) {
        for (uint256 i = 1; i <= size; i++) {
            if (heapArray[i].addr == _addr) {
                return true;
            }
        }
        return false;
    }

    function _bubbleUp(uint256 index) private {
        while (
            index > 1 &&
            heapArray[index / 2].priority < heapArray[index].priority
        ) {
            // Use a temporary variable to safely perform the swap
            QueueElement memory temp = heapArray[index];
            heapArray[index] = heapArray[index / 2];
            heapArray[index / 2] = temp;

            index /= 2; // Move up to the parent's index
        }
    }

    function _bubbleDown(uint256 index) private {
        while (index * 2 <= size) {
            uint256 largest = index;
            uint256 leftChildIndex = 2 * index;
            uint256 rightChildIndex = 2 * index + 1;

            if (
                leftChildIndex <= size &&
                heapArray[leftChildIndex].priority > heapArray[largest].priority
            ) {
                largest = leftChildIndex;
            }
            if (
                rightChildIndex <= size &&
                heapArray[rightChildIndex].priority >
                heapArray[largest].priority
            ) {
                largest = rightChildIndex;
            }
            if (largest == index) {
                break; // The node is already in the correct position
            }
            // Swap using a temporary variable
            QueueElement memory temp = heapArray[index];
            heapArray[index] = heapArray[largest];
            heapArray[largest] = temp;
            index = largest; // Continue with the largest child
        }
    }

    function isEmpty() public view returns (bool) {
        return size == 0;
    }
}
