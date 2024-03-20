// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriorityQueue {
    struct QueueElement {
        address addr;
        uint256 priority;
    }

    QueueElement[] private heapArray;
    uint256 public size;

    constructor() {
        // Dummy element to start indexing from 1
        heapArray.push(QueueElement({addr: address(0), priority: 0}));
        size = 0;
    }

    //Adding to queue
    function enqueue(address _addr, uint256 _priority) public {
        QueueElement memory element = QueueElement({
            addr: _addr,
            priority: _priority
        });
        heapArray.push(element);
        size++;
        _bubbleUp(size);
    }

    function _bubbleUp(uint256 index) private {
        while (
            index > 1 &&
            heapArray[index / 2].priority > heapArray[index].priority
        ) {
            QueueElement memory temp = heapArray[index / 2];
            heapArray[index / 2] = heapArray[index];
            heapArray[index] = temp;
            index = index / 2;
        }
    }

    //Remove from queue
    function dequeue() public returns (address) {
        require(size > 0, "Queue is empty");

        // Get the address of the highest priority element
        address highestPriorityAddress = heapArray[1].addr;

        // Perform the pop operation to remove the highest priority element
        // Similar logic to the existing pop method but adapted for QueueElement struct
        QueueElement memory lastElement = heapArray[size];
        heapArray[1] = lastElement;
        heapArray.pop();
        size--;
        if (size > 0) {
            _bubbleDown(1);
        }

        return highestPriorityAddress;
    }

    function _bubbleDown(uint256 index) private {
        uint256 smallest = index;
        uint256 leftChildIndex = 2 * index;
        uint256 rightChildIndex = 2 * index + 1;

        if (
            leftChildIndex <= size &&
            heapArray[leftChildIndex].priority < heapArray[smallest].priority
        ) {
            smallest = leftChildIndex;
        }
        if (
            rightChildIndex <= size &&
            heapArray[rightChildIndex].priority < heapArray[smallest].priority
        ) {
            smallest = rightChildIndex;
        }
        if (smallest != index) {
            QueueElement memory temp = heapArray[index];
            heapArray[index] = heapArray[smallest];
            heapArray[smallest] = temp;
            _bubbleDown(smallest);
        }
    }

    function isEmpty() public view returns (bool) {
        return size == 0;
    }
}
