<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;

class UserMeStateProvider implements ProviderInterface
{
    public function __construct(private Security $security, private UserRepository $userRepository)
    {
    }
    
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        return $this->userRepository->findOneBy(['email' => $this->security->getUser()->getUserIdentifier()]);
    }
}
