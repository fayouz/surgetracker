<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


final class UserProcessor implements ProcessorInterface
{

    public function __construct(
        private readonly ProcessorInterface $persistProcessor,
        private UserPasswordHasherInterface $passwordHasher
    )
    {
    }

    /**
     * {@inheritDoc}
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($operation instanceof Post && $data->getPassword()) {
            $data->setPassword(
                $this->passwordHasher->hashPassword($data, $data->getPassword())
            );
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }


    public function supports($data): bool
    {
        return $data instanceof User;
    }

}
