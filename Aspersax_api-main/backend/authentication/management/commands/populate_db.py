from django.core.management.base import BaseCommand
from initial_data import create_initial_data

class Command(BaseCommand):
    help = 'Populates the database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Creating initial data...')
        create_initial_data()
        self.stdout.write(self.style.SUCCESS('Successfully created initial data')) 