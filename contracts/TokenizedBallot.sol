// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ERC20Votes.sol";

contract Ballot {
    MyToken public voteToken;
    uint256 public targetBlockNumber;
  
    struct Proposal {
        bytes32 name;  
        uint voteCount; 
    }

mapping(address => uint256) spentVotePower;

    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames, address _voteToken, uint256 _targetBlockNumber) {
        voteToken = MyToken(_voteToken);
        targetBlockNumber=_targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {

            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint proposal, uint256 amount) external {
        //Require amount <= amountICanVote
       require(votePower(msg.sender) >= amount, "Not enough vote power");
        proposals[proposal].voteCount += amount;
        spentVotePower[msg.sender] += amount;
        //increase spent vote power for that account
    }

    function votePower(address account)public view returns(uint256){
        //[calling another contract to getPastVotes] - [spent votePower for that account]
        return voteToken.getPastVotes(account,  targetBlockNumber) - spentVotePower[account];
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}