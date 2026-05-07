#include<stdio.h>
#include<pthread.h>

void* helper(void* arg){
    printf("This is the helper function thread");
    return NULL;
}

int main(){
    pthread_t thread1;

    pthread_create(&thread1,NULL,helper,NULL);
    printf("This is the boss");
    pthread_join(thread1,NULL);
    return 0;
}